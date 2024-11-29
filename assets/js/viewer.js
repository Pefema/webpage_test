async function loadStructure() {
    const pdbId = document.getElementById('pdbInput').value.trim().toUpperCase();
    if (!pdbId) {
        return; // Do nothing if input is empty
    }

    // Try to load the PDB file first
    const pdbUrl = `https://files.rcsb.org/download/${pdbId}.pdb`;
    let structureUrl = pdbUrl;
    let fileType = "pdb";

    // First attempt: Try to fetch the PDB file
    let response = await fetch(pdbUrl);
    if (!response.ok) {
        // If PDB file is not available, switch to CIF file
        const cifUrl = `https://files.rcsb.org/download/${pdbId}.cif`;
        response = await fetch(cifUrl); // Try CIF file
        if (!response.ok) return; // Exit if CIF file also fails
        fileType = "mmcif"; // Set to mmCIF if CIF file is used
    }

    // Once a valid response is obtained, process the structure (PDB or CIF)
    const structureText = await response.text();

    // Initialize the viewer
    const viewer = $3Dmol.createViewer("viewer", { backgroundColor: "white" });
    viewer.addModel(structureText, fileType); // Load as pdb or mmCIF based on the file
    viewer.setStyle({}, { cartoon: { color: "spectrum" } });
    viewer.zoomTo();
    viewer.render();
}