let plugin;

async function initViewer() {
    plugin = await createPlugin();
    
    // Add representation type change listener
    document.getElementById('representationType').addEventListener('change', updateRepresentation);
    
    // Add enter key listener for PDB input
    document.getElementById('pdbInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadStructure();
    });
}

async function createPlugin() {
    const plugin = await new molstar.PluginContext();
    await plugin.init();
    
    plugin.canvas3d.layout.setProps({
        layoutIsExpanded: false,
        hideControls: false,
        landscape: true
    });
    
    await plugin.canvas3d.setBackground({ color: 0xffffff });
    return plugin;
}

async function loadStructure() {
    const pdbId = document.getElementById('pdbInput').value.trim().toUpperCase();
    const errorElement = document.getElementById('error');
    
    if (!pdbId) return;
    
    try {
        errorElement.style.display = 'none';
        
        // Clear previous structure
        await plugin.clear();
        
        // Load new structure
        await plugin.loadStructureFromUrl(
            `https://files.rcsb.org/download/${pdbId}.cif`,
            'mmcif',
            { representation: getRepresentationParams() }
        );
        
        // Center and auto-zoom
        plugin.canvas3d.resetCamera();
        plugin.canvas3d.requestRepaint();
        
    } catch (error) {
        console.error('Failed to load structure:', error);
        errorElement.style.display = 'block';
    }
}

function getRepresentationParams() {
    const type = document.getElementById('representationType').value;
    switch (type) {
        case 'cartoon':
            return { type: 'cartoon', color: 'chain-id' };
        case 'ball-and-stick':
            return { type: 'ball-and-stick', color: 'element' };
        case 'spacefill':
            return { type: 'spacefill', color: 'element' };
        default:
            return { type: 'cartoon', color: 'chain-id' };
    }
}

async function updateRepresentation() {
    if (!plugin) return;
    
    const params = getRepresentationParams();
    await plugin.clear();
    const pdbId = document.getElementById('pdbInput').value.trim().toUpperCase();
    
    if (pdbId) {
        await loadStructure();
    }
}

// Initialize viewer when page loads
window.addEventListener('load', initViewer);