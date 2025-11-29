# GeoJSON Extraction from DWG Files

Guide for extracting parcel boundary data from AutoCAD DWG files.

---

## 📋 What We Need

### From the Client

1. **DWG File** - AutoCAD drawing of the camp map with:
   - Parcel boundaries as closed polylines
   - Parcel labels/codes (A1, A2, B1, etc.)
   - Zone groupings
   - Coordinates (ideally georeferenced)

2. **Parcel List** - Excel/CSV with:
   - Parcel code
   - Zone assignment
   - Capacity
   - Amenities (electricity, water)

### What Developer Produces

- GeoJSON file with all parcel polygons
- Each parcel properly tagged with properties
- Coordinates in WGS84 (latitude/longitude)

---

## 🛠️ Tool Options

### Option A: QGIS (Free, Recommended)

**QGIS** is a free, open-source GIS tool that can import DWG files.

**Download**: [qgis.org](https://qgis.org/en/site/forusers/download.html)

### Option B: AutoCAD (If Available)

If client has AutoCAD, they can export directly to GeoJSON.

### Option C: Online Converters

For simple files, online tools may work:
- [MyGeodata Converter](https://mygeodata.cloud/converter/dwg-to-geojson)
- [Convertio](https://convertio.co/dwg-geojson/)

⚠️ **Note**: Online converters may not handle complex DWG files well.

---

## 📖 Step-by-Step: QGIS Method

### Step 1: Install QGIS

1. Download QGIS from [qgis.org](https://qgis.org)
2. Install with default settings
3. Open QGIS Desktop

### Step 2: Import DWG File

1. Go to **Layer → Add Layer → Add Vector Layer**
2. Click **...** to browse for your DWG file
3. Select the DWG file
4. Click **Add**

QGIS will show a dialog listing all layers in the DWG. Common layers:
- `entities` - All drawing objects
- `blocks` - Block definitions
- `polyline` - Polyline layer (usually parcels)

5. Select the layer containing parcel boundaries (typically `polyline` or `entities`)
6. Click **Add Layers**

### Step 3: Filter Parcel Polygons

If the layer contains multiple object types:

1. Right-click layer → **Filter**
2. Add filter expression:
   ```
   "Layer" = 'PARCELS' OR "Layer" = 'BOUNDARIES'
   ```
   (Layer name depends on how DWG was created)
3. Click **OK**

### Step 4: Check Coordinate Reference System (CRS)

1. Right-click layer → **Properties → Source**
2. Check the CRS (Coordinate Reference System)

If coordinates are local (not georeferenced):
- You'll need the camp's actual GPS coordinates
- Use **Georeferencer** tool to align the drawing

If coordinates are already in a known CRS (e.g., HTRS96/TM):
- Right-click layer → **Set CRS** → Choose correct system

### Step 5: Add Parcel Properties

For each parcel, we need to add properties. There are two approaches:

#### Method A: Manual (Small Number of Parcels)

1. Toggle **Edit Mode** (pencil icon)
2. Open **Attribute Table**
3. Add new fields: `code`, `zone`, `type`
4. For each feature, add the parcel code

#### Method B: Join with CSV (Many Parcels)

1. Create CSV file with parcel data:
   ```csv
   code,zone,type,capacity_max
   A1,zone-a,tent,4
   A2,zone-a,tent,4
   B1,zone-b,tent,6
   ...
   ```

2. Import CSV: **Layer → Add Layer → Add Delimited Text Layer**

3. Join layers: **Layer → Properties → Joins**
   - Join field: matching code field

### Step 6: Reproject to WGS84

Our map uses WGS84 (EPSG:4326) coordinates:

1. Right-click layer → **Export → Save Features As**
2. Format: **GeoJSON**
3. CRS: **EPSG:4326 - WGS84**
4. File name: `camp-parcels.geojson`
5. Click **OK**

### Step 7: Clean Up GeoJSON

Open the exported file and ensure it looks like:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "Parcel": "A1",
        "Zone": "A",
        "Name": null,
        "Type": "tent"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [16.70650, 43.16150],
          [16.70660, 43.16150],
          [16.70660, 43.16160],
          [16.70650, 43.16160],
          [16.70650, 43.16150]
        ]]
      }
    }
  ]
}
```

---

## 🌍 Georeferencing (If Needed)

If the DWG uses local coordinates (not GPS), you need to georeference:

### Method 1: Known Reference Points

1. Identify 3-4 points on the map with known GPS coordinates
   - Camp entrance
   - Beach access point
   - Road intersection
   
2. Use **Raster → Georeferencer**
3. Add ground control points (GCPs)
4. Apply transformation

### Method 2: Manual Alignment

1. Add satellite basemap:
   - **Plugins → Manage Plugins → QuickMapServices**
   - Install and enable
   - **Web → QuickMapServices → Google → Google Satellite**

2. Scale and position the DWG layer to match satellite imagery
3. Export with correct coordinates

### Camp Holiday GPS Reference

```
Camp center (approximate):
Latitude: 43.16167
Longitude: 16.70674

Beach access:
Latitude: 43.1612
Longitude: 16.7065

Main entrance:
Latitude: 43.1620
Longitude: 16.7075
```

---

## 📊 Expected GeoJSON Structure

### Final Format

```json
{
  "type": "FeatureCollection",
  "name": "Camp Holiday Parcels",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "Parcel": "A1",
        "Zone": "A",
        "Name": null,
        "Type": "tent",
        "Capacity": 4,
        "HasElectricity": true,
        "HasWater": false
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [16.70650, 43.16150],
          [16.70660, 43.16150],
          [16.70660, 43.16160],
          [16.70650, 43.16160],
          [16.70650, 43.16150]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "Parcel": "G1",
        "Zone": "GLAMPING",
        "Name": "Gdinj",
        "Type": "glamping",
        "Capacity": 3,
        "HasElectricity": true,
        "HasWater": true
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [16.70700, 43.16200],
          [16.70720, 43.16200],
          [16.70720, 43.16220],
          [16.70700, 43.16220],
          [16.70700, 43.16200]
        ]]
      }
    }
  ]
}
```

### Property Schema

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `Parcel` | string | Unique code (A1, B2, P1, etc.) | Yes |
| `Zone` | string | Zone identifier (A, B, C, P1, P2, GLAMPING) | Yes |
| `Name` | string | For glamping tents (Gdinj, Jelsa, etc.) | No |
| `Type` | string | tent, camper, glamping | Yes |
| `Capacity` | number | Max guests | Yes |
| `HasElectricity` | boolean | Has power hookup | No |
| `HasWater` | boolean | Has water hookup | No |

---

## 🔄 Importing to Project

### 1. Update Data File

Replace or update `src/data/map-geojson.ts`:

```typescript
// src/data/map-geojson.ts

export const zoneColors: Record<string, { fill: string; stroke: string; name: string }> = {
  A: { fill: "#5B9BD5", stroke: "#4A8AC4", name: "Tent Zone A" },
  B: { fill: "#70AD47", stroke: "#5F9C36", name: "Tent Zone B" },
  C: { fill: "#7B7DB5", stroke: "#6A6CA4", name: "Tent Zone C" },
  P1: { fill: "#9DC3E6", stroke: "#8CB2D5", name: "Camper Pitch 1" },
  P2: { fill: "#B48FCF", stroke: "#A37EBE", name: "Camper Pitch 2" },
  GLAMPING: { fill: "#ED7D31", stroke: "#DC6C20", name: "Glamping" },
  PARKING: { fill: "#808080", stroke: "#6F6F6F", name: "Parking" },
};

export const campGeoJSON = {
  type: "FeatureCollection",
  features: [
    // Paste features from exported GeoJSON here
    // ...
  ]
} as const;
```

### 2. Verify on Map

1. Start development server: `npm run dev`
2. Navigate to `/map`
3. Verify all parcels display correctly
4. Check click interactions work

---

## 🧪 Testing Checklist

- [ ] All parcels visible on map
- [ ] Correct zone colors applied
- [ ] Click selects correct parcel
- [ ] Popup shows correct info
- [ ] Coordinates align with satellite view
- [ ] No overlapping polygons
- [ ] All parcel codes unique

---

## 📞 If Client Needs Help

### Request from Client

Send this to client:

> We need the camp DWG file to extract parcel boundaries for the interactive map. Please provide:
> 
> 1. **DWG File** - Camp layout with parcel boundaries
> 2. **Parcel List** - Excel with columns:
>    - Parcel Code (A1, A2, B1, etc.)
>    - Zone (Zone A, Zone B, etc.)
>    - Max Capacity
>    - Has Electricity (yes/no)
>    - Has Water (yes/no)
> 3. **GPS Reference** - If the DWG is not georeferenced, please provide GPS coordinates for 2-3 known points on the map (e.g., entrance, beach access).

### Alternative: Manual Drawing

If client cannot provide DWG:

1. Use current map image as background
2. Manually trace parcels in QGIS or [geojson.io](https://geojson.io)
3. Save as GeoJSON
4. Add properties manually

---

## 🔗 Resources

- **QGIS Documentation**: [docs.qgis.org](https://docs.qgis.org)
- **GeoJSON Specification**: [geojson.org](https://geojson.org)
- **geojson.io**: Online GeoJSON editor
- **MapShaper**: [mapshaper.org](https://mapshaper.org) - Simplify and convert geo data

---

*Next: [16-ADMIN-PANEL-REQUIREMENTS.md](./16-ADMIN-PANEL-REQUIREMENTS.md) for admin features*

