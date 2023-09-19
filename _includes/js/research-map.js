    // Initialize the map centered on a central point in Poland
    var map = L.map('researchGroupsMap').setView([52.0690, 19.4803], 6.2); 

    // Set the base map layer to Stamen's Toner tiles
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    }).addTo(map);

    var researchGroupIcon = L.divIcon({
        className: 'custom-icon',
        html: '<img src="{{ "./lab-logo/example.jpg" | relative_url }}" style="border: 2px solid #e7322a; width: 30px; height: 30px;" />', // Fixed size of 30x30 pixels
        iconSize: [40, 40],
        iconAnchor: [15, 15],  // Adjusted anchor point
        popupAnchor: [0, -15]  // Centered popup above the marker 
    });

    // Marker using the custom icon in Warsaw
    var marker = L.marker([52.2297, 21.0122], { icon: researchGroupIcon }).addTo(map);
    marker.bindPopup('<b><a href="{{ "./labs/example-lab" | relative_url }}" target="_blank">Research Group Name</a></b><br>Short Description').openPopup();

    // Example data
    var totalLabs = 10;  // This should come from your data source
    var totalProjects = 15;  // This should also come from your data source

    // Set the summary text
    document.getElementById("summaryText").innerHTML = `There are a total of <b>${totalLabs} labs</b> and <b>${totalProjects} projects</b> participating in research platforms.`;
