#!/usr/bin/env node

/**
 * Process camp GeoJSON files:
 * 1. Convert UTM coordinates to WGS84
 * 2. Match labels to polygons
 * 3. Create final merged GeoJSON
 */

const fs = require('fs');
const path = require('path');

// HTRS96/TM (Croatian TM - EPSG:3765) to WGS84 conversion
// Central meridian is 16.5°E, not 15°E like UTM 33N
function utmToLatLng(easting, northing) {
  // WGS84/GRS80 parameters (used by HTRS96)
  const a = 6378137.0; // semi-major axis
  const f = 1 / 298.257222101; // GRS80 flattening
  const k0 = 0.9999; // scale factor for HTRS96/TM
  
  const e2 = 2 * f - f * f; // first eccentricity squared
  const e = Math.sqrt(e2);
  const e_prime2 = e2 / (1 - e2); // second eccentricity squared
  
  // HTRS96/TM central meridian (Croatia)
  const lon0 = 16.5 * Math.PI / 180; // 16.5°E for Croatian TM
  
  // Remove false easting (500000m)
  const x = easting - 500000;
  const y = northing; // Northern hemisphere
  
  // Footpoint latitude calculation
  const M = y / k0;
  const mu = M / (a * (1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256));
  
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  
  const phi1 = mu 
    + (3*e1/2 - 27*Math.pow(e1,3)/32) * Math.sin(2*mu)
    + (21*e1*e1/16 - 55*Math.pow(e1,4)/32) * Math.sin(4*mu)
    + (151*Math.pow(e1,3)/96) * Math.sin(6*mu)
    + (1097*Math.pow(e1,4)/512) * Math.sin(8*mu);
  
  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const tanPhi1 = Math.tan(phi1);
  
  const N1 = a / Math.sqrt(1 - e2 * sinPhi1 * sinPhi1);
  const T1 = tanPhi1 * tanPhi1;
  const C1 = e_prime2 * cosPhi1 * cosPhi1;
  const R1 = a * (1 - e2) / Math.pow(1 - e2 * sinPhi1 * sinPhi1, 1.5);
  const D = x / (N1 * k0);
  
  // Calculate latitude
  const lat = phi1 - (N1 * tanPhi1 / R1) * (
    D*D/2 
    - (5 + 3*T1 + 10*C1 - 4*C1*C1 - 9*e_prime2) * Math.pow(D,4)/24
    + (61 + 90*T1 + 298*C1 + 45*T1*T1 - 252*e_prime2 - 3*C1*C1) * Math.pow(D,6)/720
  );
  
  // Calculate longitude
  const lon = lon0 + (
    D 
    - (1 + 2*T1 + C1) * Math.pow(D,3)/6
    + (5 - 2*C1 + 28*T1 - 3*C1*C1 + 8*e_prime2 + 24*T1*T1) * Math.pow(D,5)/120
  ) / cosPhi1;
  
  return {
    lat: lat * 180 / Math.PI,
    lng: lon * 180 / Math.PI
  };
}

// Convert polygon coordinates from UTM to WGS84
function convertPolygonCoords(coordinates) {
  return coordinates.map(ring => 
    ring.map(coord => {
      const [easting, northing] = coord;
      const { lat, lng } = utmToLatLng(easting, northing);
      return [lng, lat]; // GeoJSON uses [lng, lat] order
    })
  );
}

// Convert point coordinates from UTM to WGS84
function convertPointCoords(coordinates) {
  const [easting, northing] = coordinates;
  const { lat, lng } = utmToLatLng(easting, northing);
  return [lng, lat];
}

// Check if a point is inside a polygon using ray casting algorithm
function pointInPolygon(point, polygon) {
  const [x, y] = point;
  const ring = polygon[0]; // Outer ring
  
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

// Get zone from parcel code
function getZoneFromCode(code) {
  if (!code) return null;
  const match = code.match(/^([A-Z]+)/);
  if (match) {
    const prefix = match[1];
    if (prefix === 'A') return 'A';
    if (prefix === 'B') return 'B';
    if (prefix === 'C') return 'C';
    if (prefix === 'P') return 'P'; // Camper pitches
    if (prefix === 'F') return 'F'; // If exists
  }
  return null;
}

// Main processing function
async function processGeoJSON() {
  const baseDir = path.join(__dirname, '../email docs/convert dwg');
  
  // Read input files
  const parcelsFile = path.join(baseDir, 'camp-parcels-final.geojson');
  const labelsFile = path.join(baseDir, 'camp-labels.geojson');
  
  console.log('Reading input files...');
  
  const parcelsData = JSON.parse(fs.readFileSync(parcelsFile, 'utf8'));
  const labelsData = JSON.parse(fs.readFileSync(labelsFile, 'utf8'));
  
  console.log(`Found ${parcelsData.features.length} polygons`);
  console.log(`Found ${labelsData.features.length} labels`);
  
  // Filter labels to only parcel codes (A, B, C, P followed by numbers)
  const parcelLabels = labelsData.features.filter(f => {
    const text = f.properties?.Text;
    return text && /^[ABCP]\d+$/.test(text);
  });
  
  console.log(`Found ${parcelLabels.length} parcel labels (including duplicates)`);
  
  // Convert label coordinates to WGS84 and deduplicate
  const labelMap = new Map();
  for (const label of parcelLabels) {
    const code = label.properties.Text;
    // Keep first occurrence of each label code
    if (!labelMap.has(code)) {
      const coords = convertPointCoords(label.geometry.coordinates);
      labelMap.set(code, {
        code: code,
        coords: coords,
        zone: getZoneFromCode(code)
      });
    }
  }
  
  const convertedLabels = Array.from(labelMap.values());
  console.log(`Unique parcel labels: ${convertedLabels.length}`);
  
  // Process polygons
  const processedFeatures = [];
  let matchedCount = 0;
  let unmatchedCount = 0;
  
  for (const feature of parcelsData.features) {
    // Convert polygon coordinates
    const convertedCoords = convertPolygonCoords(feature.geometry.coordinates);
    
    // Find label that's inside this polygon
    let matchedLabel = null;
    for (const label of convertedLabels) {
      if (pointInPolygon(label.coords, convertedCoords)) {
        matchedLabel = label;
        break;
      }
    }
    
    if (matchedLabel) {
      matchedCount++;
      processedFeatures.push({
        type: 'Feature',
        properties: {
          Parcel: matchedLabel.code,
          Zone: matchedLabel.zone,
          Name: matchedLabel.code
        },
        geometry: {
          type: 'Polygon',
          coordinates: convertedCoords
        }
      });
    } else {
      unmatchedCount++;
      // Still include unmatched polygons (might be paths, parking, etc.)
      processedFeatures.push({
        type: 'Feature',
        properties: {
          Parcel: null,
          Zone: 'OTHER',
          Name: null
        },
        geometry: {
          type: 'Polygon',
          coordinates: convertedCoords
        }
      });
    }
  }
  
  console.log(`Matched: ${matchedCount}, Unmatched: ${unmatchedCount}`);
  
  // Create output GeoJSON
  const outputGeoJSON = {
    type: 'FeatureCollection',
    name: 'camp-map-final',
    features: processedFeatures
  };
  
  // Write full output (including unmatched)
  const outputFile = path.join(baseDir, 'camp-map-processed.geojson');
  fs.writeFileSync(outputFile, JSON.stringify(outputGeoJSON, null, 2));
  console.log(`\nFull output written to: ${outputFile}`);
  
  // Write filtered output (only matched parcels)
  const matchedFeatures = processedFeatures.filter(f => f.properties.Parcel !== null);
  const matchedGeoJSON = {
    type: 'FeatureCollection',
    name: 'camp-parcels-matched',
    features: matchedFeatures
  };
  const matchedFile = path.join(baseDir, 'camp-parcels-matched.geojson');
  fs.writeFileSync(matchedFile, JSON.stringify(matchedGeoJSON, null, 2));
  console.log(`Matched parcels only: ${matchedFile}`);
  
  // Also create a labels-only file with converted coordinates
  const convertedLabelsGeoJSON = {
    type: 'FeatureCollection',
    name: 'camp-labels-wgs84',
    features: convertedLabels.map(label => ({
      type: 'Feature',
      properties: {
        Text: label.code,
        Zone: label.zone
      },
      geometry: {
        type: 'Point',
        coordinates: label.coords
      }
    }))
  };
  
  const labelsOutputFile = path.join(baseDir, 'camp-labels-wgs84.geojson');
  fs.writeFileSync(labelsOutputFile, JSON.stringify(convertedLabelsGeoJSON, null, 2));
  console.log(`Labels written to: ${labelsOutputFile}`);
  
  // Print summary of parcels by zone
  console.log('\n--- Summary by Zone ---');
  const byZone = {};
  for (const feature of processedFeatures) {
    const zone = feature.properties.Zone || 'UNKNOWN';
    if (!byZone[zone]) byZone[zone] = [];
    if (feature.properties.Parcel) {
      byZone[zone].push(feature.properties.Parcel);
    }
  }
  
  for (const [zone, parcels] of Object.entries(byZone)) {
    console.log(`${zone}: ${parcels.length} parcels - ${parcels.sort().join(', ')}`);
  }
  
  // Sample coordinates for verification
  console.log('\n--- Sample Coordinates (first parcel) ---');
  const firstParcel = processedFeatures.find(f => f.properties.Parcel);
  if (firstParcel) {
    const coords = firstParcel.geometry.coordinates[0][0];
    console.log(`Parcel ${firstParcel.properties.Parcel}: [${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}]`);
  }
}

processGeoJSON().catch(console.error);

