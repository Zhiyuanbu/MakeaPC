class PCBuilderApp {
    constructor() {
        this.currentBuild = {};
        this.currentCategory = 'cpu';
        this.isInitialized = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadComponents();
        this.setupDragAndDrop();
        this.updateDisplay();
        this.isInitialized = true;

        // Load saved build if exists
        this.loadFromStorage();
    }

    setupEventListeners() {
        // Category tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.target.dataset.category);
            });
        });

        // Build management buttons
        document.getElementById('prebuilt-builds').addEventListener('click', () => this.showPrebuiltConfigurations());
        document.getElementById('build-templates').addEventListener('click', () => this.showBuildTemplates());
        document.getElementById('upgrade-assistant').addEventListener('click', () => this.showUpgradeAssistant());
        document.getElementById('save-build').addEventListener('click', () => this.saveBuild());
        document.getElementById('load-build').addEventListener('click', () => this.loadBuild());
        document.getElementById('clear-build').addEventListener('click', () => this.clearBuild());

        // Modal controls
        document.getElementById('modal-close').addEventListener('click', () => this.closeModal());

        // Click outside modal to close
        document.getElementById('component-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    switchCategory(category) {
        this.currentCategory = category;

        // Update tab appearance
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        this.loadComponents();
    }

    loadComponents() {
        const componentList = document.getElementById('component-list');
        const components = COMPONENTS_DATABASE[this.currentCategory] || [];

        componentList.innerHTML = '';

        components.forEach(component => {
            const componentElement = this.createComponentElement(component);
            componentList.appendChild(componentElement);
        });
    }

    createComponentElement(component) {
        const div = document.createElement('div');
        div.className = 'component-item';
        div.draggable = true;
        div.dataset.componentId = component.id;
        div.dataset.category = this.currentCategory;

        // Create specs string based on component type
        let specs = '';
        switch (this.currentCategory) {
            case 'cpu':
                specs = `${component.cores}C/${component.threads}T • ${component.boostClock}GHz • ${component.tdp}W`;
                break;
            case 'gpu':
                specs = `${component.vram}GB ${component.vramType} • ${component.tdp}W`;
                break;
            case 'motherboard':
                specs = `${component.socket} • ${component.chipset} • ${component.formFactor}`;
                break;
            case 'ram':
                specs = `${component.capacity}GB • ${component.speed}MHz • ${component.type}`;
                break;
            case 'storage':
                specs = `${component.capacity}GB • ${component.type} • ${component.readSpeed}MB/s`;
                break;
            case 'psu':
                specs = `${component.wattage}W • ${component.efficiency} • ${component.modular}`;
                break;
            case 'case':
                specs = `${component.formFactor} • ${component.color} • ${component.sidePanel}`;
                break;
            case 'cooling':
                specs = `${component.type} • ${component.tdpRating}W TDP • ${component.fanSize}mm`;
                break;
        }

        div.innerHTML = `
            <div class="component-icon">
                <i class="fas fa-${this.getIconForCategory(this.currentCategory)}"></i>
            </div>
            <div class="component-info">
                <div class="component-name">${component.name}</div>
                <div class="component-specs">${specs}</div>
            </div>
            <div class="component-price">$${component.price}</div>
        `;

        // Add click event for component details
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.dragging')) {
                this.showComponentDetails(component);
            }
        });

        return div;
    }

    getIconForCategory(category) {
        const icons = {
            cpu: 'microchip',
            gpu: 'tv',
            motherboard: 'memory',
            ram: 'sd-card',
            storage: 'hdd',
            psu: 'plug',
            case: 'desktop',
            cooling: 'fan'
        };
        return icons[category] || 'cube';
    }

    setupDragAndDrop() {
        // Setup draggable components
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('component-item')) {
                e.target.classList.add('dragging');
                document.body.classList.add('dragging-active');

                e.dataTransfer.setData('text/plain', JSON.stringify({
                    componentId: e.target.dataset.componentId,
                    category: e.target.dataset.category
                }));

                this.highlightCompatibleSlots(e.target.dataset.category);
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('component-item')) {
                e.target.classList.remove('dragging');
                document.body.classList.remove('dragging-active');
                this.clearSlotHighlights();
            }
        });

        // Setup drop zones
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.closest('.component-slot').classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                if (!zone.contains(e.relatedTarget)) {
                    zone.closest('.component-slot').classList.remove('drag-over');
                }
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.closest('.component-slot').classList.remove('drag-over');

                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                const slotType = zone.closest('.component-slot').dataset.slot;

                if (data.category === slotType) {
                    this.placeComponent(data.componentId, data.category, slotType);
                } else {
                    this.showToast('Incompatible component type!', 'error');
                }
            });
        });
    }

    highlightCompatibleSlots(category) {
        document.querySelectorAll('.component-slot').forEach(slot => {
            const slotType = slot.dataset.slot;
            if (slotType === category) {
                slot.classList.add('valid-drop');
            } else {
                slot.classList.add('invalid-drop');
            }
        });
    }

    clearSlotHighlights() {
        document.querySelectorAll('.component-slot').forEach(slot => {
            slot.classList.remove('valid-drop', 'invalid-drop');
        });
    }

    placeComponent(componentId, category, slotType) {
        const component = this.findComponent(componentId, category);
        if (!component) return;

        // Check compatibility before placing
        const compatibility = this.checkComponentCompatibility(component, category);

        this.currentBuild[slotType] = {
            component,
            category,
            compatible: compatibility.compatible,
            issues: compatibility.issues
        };

        this.updateSlotDisplay(slotType);
        this.updateDisplay();
        this.updatePerformanceAndBenchmarks();

        if (!compatibility.compatible) {
            this.showToast(`Warning: ${compatibility.issues.join(', ')}`, 'warning');
        } else {
            this.showToast(`${component.name} installed successfully!`, 'success');
        }
    }

    findComponent(componentId, category) {
        return COMPONENTS_DATABASE[category]?.find(comp => comp.id === componentId);
    }

    updateSlotDisplay(slotType) {
        const slot = document.getElementById(`${slotType}-slot`);
        const buildComponent = this.currentBuild[slotType];

        if (buildComponent) {
            const { component, category, compatible } = buildComponent;

            slot.innerHTML = `
                <div class="placed-component">
                    <div class="component-icon">
                        <i class="fas fa-${this.getIconForCategory(category)}"></i>
                    </div>
                    <div class="component-info">
                        <div class="component-name">${component.name}</div>
                        <div class="component-specs">$${component.price}</div>
                    </div>
                    <button class="remove-component" onclick="pcBuilder.removeComponent('${slotType}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            const slotElement = slot.closest('.component-slot');
            slotElement.classList.add('has-component');
            slotElement.classList.toggle('incompatible', !compatible);
        } else {
            // Restore placeholder
            const slotElement = slot.closest('.component-slot');
            const slotName = slotElement.querySelector('.slot-header span').textContent;
            const icon = this.getIconForCategory(slotType);

            slot.innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-${icon}"></i>
                    <span>Drop ${slotName} Here</span>
                </div>
            `;

            slotElement.classList.remove('has-component', 'incompatible');
        }
    }

    removeComponent(slotType) {
        delete this.currentBuild[slotType];
        this.updateSlotDisplay(slotType);
        this.updateDisplay();
        this.updatePerformanceAndBenchmarks();
        this.showToast('Component removed', 'success');
    }

    checkComponentCompatibility(component, category) {
        const issues = [];
        let compatible = true;

        // Check CPU-Motherboard compatibility
        if (category === 'cpu' || category === 'motherboard') {
            const cpu = category === 'cpu' ? component : this.currentBuild.cpu?.component;
            const motherboard = category === 'motherboard' ? component : this.currentBuild.motherboard?.component;

            if (cpu && motherboard) {
                const compatibleSockets = COMPATIBILITY_RULES.cpuMotherboard[cpu.socket] || [];
                if (!compatibleSockets.includes(motherboard.socket)) {
                    issues.push(`CPU socket ${cpu.socket} not compatible with motherboard socket ${motherboard.socket}`);
                    compatible = false;
                }
            }
        }

        // Check RAM-Motherboard compatibility
        if (category === 'ram' || category === 'motherboard') {
            const ram = category === 'ram' ? component : this.currentBuild.ram?.component;
            const motherboard = category === 'motherboard' ? component : this.currentBuild.motherboard?.component;

            if (ram && motherboard) {
                if (ram.type !== motherboard.ramType) {
                    issues.push(`RAM type ${ram.type} not compatible with motherboard ${motherboard.ramType}`);
                    compatible = false;
                }
            }
        }

        // Check power supply sufficiency
        if (category === 'gpu' || category === 'cpu' || category === 'psu') {
            const totalPowerNeeded = this.calculateTotalPowerConsumption(component, category);
            const psu = category === 'psu' ? component : this.currentBuild.psu?.component;

            if (psu && totalPowerNeeded > psu.wattage * 0.8) { // 80% PSU rule
                issues.push(`Power supply insufficient: ${totalPowerNeeded}W needed, ${Math.round(psu.wattage * 0.8)}W available (80% rule)`);
                compatible = false;
            }
        }

        // Check case compatibility
        if (category === 'case' || category === 'motherboard') {
            const caseComp = category === 'case' ? component : this.currentBuild.case?.component;
            const motherboard = category === 'motherboard' ? component : this.currentBuild.motherboard?.component;

            if (caseComp && motherboard) {
                const supportedFormFactors = COMPATIBILITY_RULES.caseMotherboardCompatibility[caseComp.formFactor] || [];
                if (!supportedFormFactors.includes(motherboard.formFactor)) {
                    issues.push(`Case doesn't support ${motherboard.formFactor} motherboard`);
                    compatible = false;
                }
            }
        }

        return { compatible, issues };
    }

    calculateTotalPowerConsumption(newComponent = null, newCategory = null) {
        let totalPower = 50; // Base system power consumption

        // Add CPU power
        const cpu = newCategory === 'cpu' ? newComponent : this.currentBuild.cpu?.component;
        if (cpu) {
            totalPower += cpu.tdp;
        }

        // Add GPU power
        const gpu = newCategory === 'gpu' ? newComponent : this.currentBuild.gpu?.component;
        if (gpu) {
            totalPower += gpu.tdp;
        }

        // Add other components (estimated)
        const motherboard = newCategory === 'motherboard' ? newComponent : this.currentBuild.motherboard?.component;
        if (motherboard) totalPower += 30;

        const ram = newCategory === 'ram' ? newComponent : this.currentBuild.ram?.component;
        if (ram) totalPower += ram.capacity * 2; // ~2W per GB

        const storage = newCategory === 'storage' ? newComponent : this.currentBuild.storage?.component;
        if (storage) totalPower += storage.type === 'NVMe SSD' ? 8 : storage.type === 'SSD' ? 5 : 10;

        const cooling = newCategory === 'cooling' ? newComponent : this.currentBuild.cooling?.component;
        if (cooling) totalPower += cooling.type === 'AIO Liquid Cooler' ? 25 : 10;

        return totalPower;
    }

    updateDisplay() {
        this.updateTotalCost();
        this.updateCompatibilityStatus();
        this.updatePowerConsumption();
        this.updateCompatibilityIssues();
        this.calculatePerformance();
    }

    updateTotalCost() {
        const totalCost = Object.values(this.currentBuild).reduce((sum, item) => {
            return sum + (item.component?.price || 0);
        }, 0);

        document.getElementById('total-cost').textContent = totalCost.toLocaleString();
    }

    updateCompatibilityStatus() {
        const hasIncompatibleComponents = Object.values(this.currentBuild).some(item => !item.compatible);
        const statusElement = document.getElementById('compatibility-status');

        if (hasIncompatibleComponents) {
            statusElement.className = 'compatibility-status incompatible';
            statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Compatibility Issues';
        } else {
            statusElement.className = 'compatibility-status compatible';
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Compatible';
        }
    }

    updatePowerConsumption() {
        const powerUsage = this.calculateTotalPowerConsumption();
        const psu = this.currentBuild.psu?.component;
        const psuWattage = psu ? psu.wattage : 0;

        document.getElementById('power-usage').textContent = powerUsage;
        document.getElementById('power-supply').textContent = psuWattage;

        const powerPercentage = psuWattage > 0 ? (powerUsage / psuWattage) * 100 : 0;
        document.getElementById('power-bar-fill').style.width = `${Math.min(powerPercentage, 100)}%`;
    }

    updateCompatibilityIssues() {
        const issuesList = document.getElementById('issues-list');
        const allIssues = [];

        Object.values(this.currentBuild).forEach(item => {
            if (item.issues && item.issues.length > 0) {
                allIssues.push(...item.issues);
            }
        });

        if (allIssues.length === 0) {
            issuesList.innerHTML = `
                <div class="no-issues">
                    <i class="fas fa-check-circle"></i>
                    <span>No compatibility issues detected</span>
                </div>
            `;
        } else {
            issuesList.innerHTML = allIssues.map(issue => `
                <div class="compatibility-issue">
                    <i class="fas fa-exclamation-triangle issue-icon"></i>
                    <span>${issue}</span>
                </div>
            `).join('');
        }
    }

    calculatePerformance() {
        const gaming = this.calculateGamingPerformance();
        const productivity = this.calculateProductivityPerformance();

        console.log('Performance calculated:', { gaming, productivity }); // Debug

        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            // Update gaming performance
            const gamingBar = document.getElementById('gaming-performance');
            const gamingScore = document.getElementById('gaming-score');
            if (gamingBar && gamingScore) {
                gamingBar.style.width = `${gaming}%`;
                gamingBar.style.transition = 'width 0.5s ease';
                gamingScore.textContent = `${Math.round(gaming)}/100`;
                console.log('Updated gaming display:', gamingBar.style.width, gamingScore.textContent);
            } else {
                console.log('Gaming elements not found:', { gamingBar, gamingScore });
            }

            // Update productivity performance
            const productivityBar = document.getElementById('productivity-performance');
            const productivityScore = document.getElementById('productivity-score');
            if (productivityBar && productivityScore) {
                productivityBar.style.width = `${productivity}%`;
                productivityBar.style.transition = 'width 0.5s ease';
                productivityScore.textContent = `${Math.round(productivity)}/100`;
                console.log('Updated productivity display:', productivityBar.style.width, productivityScore.textContent);
            } else {
                console.log('Productivity elements not found:', { productivityBar, productivityScore });
            }
        }, 100);
    }

    calculateGamingPerformance() {
        const cpu = this.currentBuild.cpu?.component;
        const gpu = this.currentBuild.gpu?.component;
        const ram = this.currentBuild.ram?.component;
        const storage = this.currentBuild.storage?.component;

        console.log('Gaming performance calculation:', { cpu: cpu?.name, gpu: gpu?.name, ram: ram?.name, storage: storage?.name }); // Debug

        if (!cpu || !gpu) {
            console.log('Missing CPU or GPU for gaming performance'); // Debug
            return 0;
        }

        const weights = PERFORMANCE_WEIGHTS.gaming;
        let score = 0;

        const cpuScore = (cpu.performance?.gaming || 0) * weights.cpu;
        const gpuScore = (gpu.performance?.gaming || 0) * weights.gpu;
        score += cpuScore + gpuScore;

        console.log('CPU/GPU scores:', { cpuScore, gpuScore, cpuPerf: cpu.performance?.gaming, gpuPerf: gpu.performance?.gaming }); // Debug

        // RAM performance factor
        if (ram) {
            const ramScore = Math.min(90, (ram.speed / 6000) * 90 + (ram.capacity / 32) * 10);
            score += ramScore * weights.ram;
        }

        // Storage performance factor
        if (storage) {
            const storageScore = storage.type === 'NVMe SSD' ? 90 : storage.type === 'SSD' ? 70 : 40;
            score += storageScore * weights.storage;
        }

        console.log('Final gaming score:', score); // Debug
        return Math.min(100, score);
    }

    calculateProductivityPerformance() {
        const cpu = this.currentBuild.cpu?.component;
        const gpu = this.currentBuild.gpu?.component;
        const ram = this.currentBuild.ram?.component;
        const storage = this.currentBuild.storage?.component;

        if (!cpu) return 0;

        const weights = PERFORMANCE_WEIGHTS.productivity;
        let score = 0;

        score += (cpu.performance?.productivity || 0) * weights.cpu;

        if (gpu) {
            score += (gpu.performance?.productivity || 0) * weights.gpu;
        }

        // RAM performance factor (more important for productivity)
        if (ram) {
            const ramScore = Math.min(95, (ram.capacity / 32) * 70 + (ram.speed / 6000) * 25);
            score += ramScore * weights.ram;
        }

        // Storage performance factor (more important for productivity)
        if (storage) {
            const storageScore = storage.type === 'NVMe SSD' ? 95 : storage.type === 'SSD' ? 75 : 45;
            score += storageScore * weights.storage;
        }

        return Math.min(100, score);
    }

    showComponentDetails(component) {
        const modal = document.getElementById('component-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = component.name;
        modalBody.innerHTML = this.generateComponentDetailsHTML(component);

        modal.classList.add('active');
    }

    generateComponentDetailsHTML(component) {
        const category = this.currentCategory;
        let html = `
            <div class="component-details">
                <div class="detail-section">
                    <h4>Basic Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Brand:</span>
                            <span class="detail-value">${component.brand}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Price:</span>
                            <span class="detail-value">$${component.price}</span>
                        </div>
        `;

        // Add category-specific details
        switch (category) {
            case 'cpu':
                html += `
                        <div class="detail-item">
                            <span class="detail-label">Socket:</span>
                            <span class="detail-value">${component.socket}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Cores/Threads:</span>
                            <span class="detail-value">${component.cores}/${component.threads}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Base Clock:</span>
                            <span class="detail-value">${component.baseClock} GHz</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Boost Clock:</span>
                            <span class="detail-value">${component.boostClock} GHz</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">TDP:</span>
                            <span class="detail-value">${component.tdp}W</span>
                        </div>
                `;
                break;
            case 'gpu':
                html += `
                        <div class="detail-item">
                            <span class="detail-label">VRAM:</span>
                            <span class="detail-value">${component.vram}GB ${component.vramType}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Base Clock:</span>
                            <span class="detail-value">${component.baseClock} MHz</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Boost Clock:</span>
                            <span class="detail-value">${component.boostClock} MHz</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">TDP:</span>
                            <span class="detail-value">${component.tdp}W</span>
                        </div>
                `;
                break;
            case 'motherboard':
                html += `
                        <div class="detail-item">
                            <span class="detail-label">Socket:</span>
                            <span class="detail-value">${component.socket}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Chipset:</span>
                            <span class="detail-value">${component.chipset}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Form Factor:</span>
                            <span class="detail-value">${component.formFactor}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">RAM Slots:</span>
                            <span class="detail-value">${component.ramSlots}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Max RAM:</span>
                            <span class="detail-value">${component.maxRam}GB</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">RAM Type:</span>
                            <span class="detail-value">${component.ramType}</span>
                        </div>
                `;
                break;
            case 'ram':
                html += `
                        <div class="detail-item">
                            <span class="detail-label">Capacity:</span>
                            <span class="detail-value">${component.capacity}GB</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Speed:</span>
                            <span class="detail-value">${component.speed} MHz</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${component.type}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Sticks:</span>
                            <span class="detail-value">${component.sticks}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Latency:</span>
                            <span class="detail-value">${component.latency}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Voltage:</span>
                            <span class="detail-value">${component.voltage}V</span>
                        </div>
                `;
                break;
            case 'storage':
                html += `
                        <div class="detail-item">
                            <span class="detail-label">Capacity:</span>
                            <span class="detail-value">${component.capacity}GB</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${component.type}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Interface:</span>
                            <span class="detail-value">${component.interface}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Read Speed:</span>
                            <span class="detail-value">${component.readSpeed} MB/s</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Write Speed:</span>
                            <span class="detail-value">${component.writeSpeed} MB/s</span>
                        </div>
                `;
                break;
            case 'psu':
                html += `
                        <div class="detail-item">
                            <span class="detail-label">Wattage:</span>
                            <span class="detail-value">${component.wattage}W</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Efficiency:</span>
                            <span class="detail-value">${component.efficiency}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Modular:</span>
                            <span class="detail-value">${component.modular}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Fan Size:</span>
                            <span class="detail-value">${component.fanSize}mm</span>
                        </div>
                `;
                break;
            case 'case':
                html += `
                        <div class="detail-item">
                            <span class="detail-label">Form Factor:</span>
                            <span class="detail-value">${component.formFactor}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Color:</span>
                            <span class="detail-value">${component.color}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Side Panel:</span>
                            <span class="detail-value">${component.sidePanel}</span>
                        </div>
                `;
                break;
            case 'cooling':
                html += `
                        <div class="detail-item">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${component.type}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">TDP Rating:</span>
                            <span class="detail-value">${component.tdpRating}W</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Fan Size:</span>
                            <span class="detail-value">${component.fanSize}mm</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Height:</span>
                            <span class="detail-value">${component.height}mm</span>
                        </div>
                `;
                break;
        }

        html += `
                    </div>
                </div>
            </div>
        `;

        // Add detailed specs if available
        if (component.specs) {
            html += `
                <div class="detail-section">
                    <h4>Detailed Specifications</h4>
                    <div class="detail-grid">
            `;

            Object.entries(component.specs).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    html += `
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <span class="detail-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                            <div style="margin-top: 0.5rem;">
                    `;
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        html += `
                            <div style="margin-left: 1rem; margin-bottom: 0.25rem;">
                                <span class="detail-label">${subKey}:</span>
                                <span class="detail-value">${subValue}</span>
                            </div>
                        `;
                    });
                    html += `</div></div>`;
                } else {
                    html += `
                        <div class="detail-item">
                            <span class="detail-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                            <span class="detail-value">${value}</span>
                        </div>
                    `;
                }
            });

            html += `
                    </div>
                </div>
            `;
        }

        return html;
    }

    closeModal() {
        document.getElementById('component-modal').classList.remove('active');
    }

    saveBuild() {
        if (Object.keys(this.currentBuild).length === 0) {
            this.showToast('No components to save!', 'warning');
            return;
        }

        const buildName = prompt('Enter a name for your build:');
        if (!buildName) return;

        const savedBuilds = JSON.parse(localStorage.getItem('pcBuilds') || '{}');
        savedBuilds[buildName] = {
            build: this.currentBuild,
            timestamp: Date.now(),
            totalCost: Object.values(this.currentBuild).reduce((sum, item) => sum + item.component.price, 0)
        };

        localStorage.setItem('pcBuilds', JSON.stringify(savedBuilds));
        this.showToast(`Build "${buildName}" saved successfully!`, 'success');
    }

    loadBuild() {
        const savedBuilds = JSON.parse(localStorage.getItem('pcBuilds') || '{}');
        const buildNames = Object.keys(savedBuilds);

        if (buildNames.length === 0) {
            this.showToast('No saved builds found!', 'warning');
            return;
        }

        const buildList = buildNames.map((name, index) => {
            const build = savedBuilds[name];
            const date = new Date(build.timestamp).toLocaleDateString();
            return `${index + 1}. ${name} - $${build.totalCost} (${date})`;
        }).join('\n');

        const selection = prompt(`Select a build to load:\n\n${buildList}\n\nEnter the number:`);
        const index = parseInt(selection) - 1;

        if (index >= 0 && index < buildNames.length) {
            const buildName = buildNames[index];
            this.currentBuild = savedBuilds[buildName].build;

            // Update all slot displays
            Object.keys(this.currentBuild).forEach(slotType => {
                this.updateSlotDisplay(slotType);
            });

            this.updateDisplay();
            this.updatePerformanceAndBenchmarks();
            this.showToast(`Build "${buildName}" loaded successfully!`, 'success');
        }
    }

    clearBuild() {
        if (Object.keys(this.currentBuild).length === 0) {
            this.showToast('Build is already empty!', 'warning');
            return;
        }

        if (confirm('Are you sure you want to clear the current build?')) {
            this.currentBuild = {};

            // Clear all slot displays
            document.querySelectorAll('.drop-zone').forEach(zone => {
                const slotType = zone.id.replace('-slot', '');
                this.updateSlotDisplay(slotType);
            });

            this.updateDisplay();
            this.updatePerformanceAndBenchmarks();
            this.showToast('Build cleared successfully!', 'success');
        }
    }

    loadFromStorage() {
        const autoSave = localStorage.getItem('pcBuilderAutoSave');
        if (autoSave) {
            try {
                this.currentBuild = JSON.parse(autoSave);

                // Update all slot displays
                Object.keys(this.currentBuild).forEach(slotType => {
                    this.updateSlotDisplay(slotType);
                });

                this.updateDisplay();
                this.updatePerformanceAndBenchmarks();
            } catch (error) {
                console.error('Error loading auto-saved build:', error);
            }
        }
    }

    saveToStorage() {
        if (this.isInitialized) {
            localStorage.setItem('pcBuilderAutoSave', JSON.stringify(this.currentBuild));
        }
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconClass = type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 'exclamation-triangle';

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${iconClass}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add close functionality
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    // Prebuilt Configuration Functions
    showPrebuiltConfigurations() {
        const modal = document.getElementById('prebuilt-modal');
        const grid = document.getElementById('prebuilt-grid');

        grid.innerHTML = '';

        Object.entries(PREBUILT_CONFIGS).forEach(([key, config]) => {
            const totalPrice = this.calculatePrebuiltPrice(config.components);
            const card = document.createElement('div');
            card.className = 'prebuilt-card';
            card.onclick = () => this.loadPrebuiltConfiguration(config);

            card.innerHTML = `
                <div class="prebuilt-header">
                    <div class="prebuilt-name">${config.name}</div>
                    <div class="prebuilt-price">$${totalPrice.toLocaleString()}</div>
                </div>
                <div class="prebuilt-description">${config.description}</div>
                <div class="prebuilt-specs">
                    ${this.generatePrebuiltSpecs(config.components)}
                </div>
            `;

            grid.appendChild(card);
        });

        modal.classList.add('active');
    }

    calculatePrebuiltPrice(components) {
        return Object.values(components).reduce((total, componentId) => {
            const category = this.getCategoryFromComponentId(componentId);
            const component = COMPONENTS_DATABASE[category]?.find(c => c.id === componentId);
            return total + (component?.price || 0);
        }, 0);
    }

    getCategoryFromComponentId(componentId) {
        for (const [category, components] of Object.entries(COMPONENTS_DATABASE)) {
            if (components.find(c => c.id === componentId)) {
                return category;
            }
        }
        return null;
    }

    generatePrebuiltSpecs(components) {
        let specs = '';
        Object.entries(components).forEach(([slotType, componentId]) => {
            const category = this.getCategoryFromComponentId(componentId);
            const component = COMPONENTS_DATABASE[category]?.find(c => c.id === componentId);
            if (component) {
                const displayName = slotType.charAt(0).toUpperCase() + slotType.slice(1);
                specs += `
                    <div class="prebuilt-spec">
                        <span class="spec-label">${displayName}:</span>
                        <span class="spec-value">${component.name}</span>
                    </div>
                `;
            }
        });
        return specs;
    }

    loadPrebuiltConfiguration(config) {
        this.clearBuild();

        Object.entries(config.components).forEach(([slotType, componentId]) => {
            const category = this.getCategoryFromComponentId(componentId);
            const component = COMPONENTS_DATABASE[category]?.find(c => c.id === componentId);

            if (component) {
                const compatibility = this.checkComponentCompatibility(component, category);
                this.currentBuild[slotType] = {
                    component,
                    category,
                    compatible: compatibility.compatible,
                    issues: compatibility.issues
                };
                this.updateSlotDisplay(slotType);
            }
        });

        this.updateDisplay();
        this.updatePerformanceAndBenchmarks();
        this.closePrebuiltModal();
        this.showToast(`${config.name} configuration loaded!`, 'success');
    }

    closePrebuiltModal() {
        document.getElementById('prebuilt-modal').classList.remove('active');
    }

    // Build Templates Functions
    showBuildTemplates() {
        const modal = document.getElementById('templates-modal');
        const grid = document.getElementById('templates-grid');

        grid.innerHTML = '';

        const templateIcons = {
            esports: 'trophy',
            streaming: 'video',
            silent: 'volume-mute'
        };

        Object.entries(BUILD_TEMPLATES).forEach(([key, template]) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.onclick = () => this.loadBuildTemplate(template);

            card.innerHTML = `
                <div class="template-icon">
                    <i class="fas fa-${templateIcons[key] || 'desktop'}"></i>
                </div>
                <div class="template-name">${template.name}</div>
                <div class="template-focus">${template.focus}</div>
            `;

            grid.appendChild(card);
        });

        modal.classList.add('active');
    }

    loadBuildTemplate(template) {
        this.clearBuild();

        Object.entries(template.components).forEach(([slotType, componentId]) => {
            const category = this.getCategoryFromComponentId(componentId);
            const component = COMPONENTS_DATABASE[category]?.find(c => c.id === componentId);

            if (component) {
                const compatibility = this.checkComponentCompatibility(component, category);
                this.currentBuild[slotType] = {
                    component,
                    category,
                    compatible: compatibility.compatible,
                    issues: compatibility.issues
                };
                this.updateSlotDisplay(slotType);
            }
        });

        this.updateDisplay();
        this.updatePerformanceAndBenchmarks();
        this.closeTemplatesModal();
        this.showToast(`${template.name} template loaded!`, 'success');
    }

    closeTemplatesModal() {
        document.getElementById('templates-modal').classList.remove('active');
    }

    // Upgrade Assistant Functions
    showUpgradeAssistant() {
        const modal = document.getElementById('upgrade-modal');
        const content = document.getElementById('upgrade-content');

        if (Object.keys(this.currentBuild).length === 0) {
            content.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-desktop" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <h3>No Build to Upgrade</h3>
                    <p style="color: var(--text-secondary);">Add components to your build first, then use the upgrade assistant to get improvement suggestions.</p>
                </div>
            `;
        } else {
            content.innerHTML = this.generateUpgradeContent();
        }

        modal.classList.add('active');
    }

    generateUpgradeContent() {
        let html = `
            <div class="upgrade-section">
                <h4>Current Build Summary</h4>
                <div class="current-build-summary">
                    <div class="build-summary-grid">
                        ${this.generateBuildSummary()}
                    </div>
                </div>
            </div>

            <div class="upgrade-section">
                <h4>Upgrade Suggestions</h4>
                <div class="upgrade-suggestions">
                    ${this.generateUpgradeSuggestions()}
                </div>
            </div>
        `;

        return html;
    }

    generateBuildSummary() {
        let html = '';
        Object.entries(this.currentBuild).forEach(([slotType, buildItem]) => {
            const component = buildItem.component;
            html += `
                <div class="build-summary-item">
                    <span>${slotType.charAt(0).toUpperCase() + slotType.slice(1)}</span>
                    <span>${component.name}</span>
                </div>
            `;
        });

        const totalCost = Object.values(this.currentBuild).reduce((sum, item) => sum + item.component.price, 0);
        html += `
            <div class="build-summary-item" style="border-top: 1px solid var(--border-color); margin-top: 0.5rem; padding-top: 0.5rem;">
                <span style="font-weight: 600;">Total Cost</span>
                <span style="font-weight: 600; color: var(--success-color);">$${totalCost.toLocaleString()}</span>
            </div>
        `;

        return html;
    }

    generateUpgradeSuggestions() {
        let html = '';

        // CPU Upgrades
        if (this.currentBuild.cpu) {
            html += this.generateCategoryUpgrades('cpu', 'CPU', 'microchip');
        }

        // GPU Upgrades
        if (this.currentBuild.gpu) {
            html += this.generateCategoryUpgrades('gpu', 'Graphics Card', 'tv');
        }

        // RAM Upgrades
        if (this.currentBuild.ram) {
            html += this.generateCategoryUpgrades('ram', 'Memory', 'sd-card');
        }

        if (html === '') {
            html = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>Your current build is already using high-end components!</p>
                </div>
            `;
        }

        return html;
    }

    generateCategoryUpgrades(category, displayName, icon) {
        const currentComponent = this.currentBuild[category].component;
        const availableComponents = COMPONENTS_DATABASE[category];

        // Find better components (higher performance or better price/performance)
        const upgrades = availableComponents.filter(comp => {
            if (comp.id === currentComponent.id) return false;

            // For CPU/GPU, look for better performance
            if (category === 'cpu' || category === 'gpu') {
                const currentPerf = (currentComponent.performance?.gaming || 0) + (currentComponent.performance?.productivity || 0);
                const compPerf = (comp.performance?.gaming || 0) + (comp.performance?.productivity || 0);
                return compPerf > currentPerf;
            }

            // For RAM, look for higher capacity or speed
            if (category === 'ram') {
                return comp.capacity > currentComponent.capacity || 
                       (comp.capacity === currentComponent.capacity && comp.speed > currentComponent.speed);
            }

            return comp.price > currentComponent.price; // Fallback to price
        }).slice(0, 3); // Limit to top 3 suggestions

        if (upgrades.length === 0) return '';

        let html = `
            <div class="upgrade-category">
                <h5><i class="fas fa-${icon}"></i> ${displayName} Upgrades</h5>
                <div class="upgrade-options">
        `;

        upgrades.forEach(upgrade => {
            const priceDiff = upgrade.price - currentComponent.price;
            const improvement = this.calculateImprovement(currentComponent, upgrade, category);

            html += `
                <div class="upgrade-option" onclick="pcBuilder.applyUpgrade('${category}', '${upgrade.id}')">
                    <div class="upgrade-info">
                        <div class="upgrade-component-name">${upgrade.name}</div>
                        <div class="upgrade-improvement">${improvement}</div>
                    </div>
                    <div class="upgrade-price ${priceDiff >= 0 ? 'cost' : 'savings'}">
                        ${priceDiff >= 0 ? '+' : ''}$${priceDiff.toLocaleString()}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    calculateImprovement(current, upgrade, category) {
        if (category === 'cpu' || category === 'gpu') {
            const currentPerf = (current.performance?.gaming || 0) + (current.performance?.productivity || 0);
            const upgradePerf = (upgrade.performance?.gaming || 0) + (upgrade.performance?.productivity || 0);
            const improvement = ((upgradePerf - currentPerf) / currentPerf * 100).toFixed(0);
            return `+${improvement}% performance`;
        }

        if (category === 'ram') {
            if (upgrade.capacity > current.capacity) {
                return `${upgrade.capacity - current.capacity}GB more capacity`;
            } else {
                const speedImprovement = ((upgrade.speed - current.speed) / current.speed * 100).toFixed(0);
                return `+${speedImprovement}% faster speed`;
            }
        }

        return 'Better specifications';
    }

    applyUpgrade(category, componentId) {
        const component = COMPONENTS_DATABASE[category]?.find(c => c.id === componentId);
        if (component) {
            this.placeComponent(componentId, category, category);
            this.closeUpgradeModal();
            this.showToast(`Upgraded to ${component.name}!`, 'success');
        }
    }

    closeUpgradeModal() {
        document.getElementById('upgrade-modal').classList.remove('active');
    }

    // Enhanced Performance Calculations with Benchmarks
    calculatePerformance() {
        const gaming = this.calculateGamingPerformance();
        const productivity = this.calculateProductivityPerformance();
        return { gaming, productivity };
    }

    updatePerformanceAndBenchmarks() {
        const performance = this.calculatePerformance();
        this.updateBenchmarkScores(performance);
    }

    updateBenchmarkScores(performance) {
        const cpu = this.currentBuild.cpu?.component;
        const gpu = this.currentBuild.gpu?.component;

        // Cyberpunk 2077 1440p FPS estimation
        let cyberpunkFps = 0;
        if (cpu && gpu) {
            const cpuScore = (cpu.performance?.gaming || 0) / 100;
            const gpuScore = (gpu.performance?.gaming || 0) / 100;
            cyberpunkFps = Math.round((cpuScore * 0.3 + gpuScore * 0.7) * 120); // Max ~120 FPS
        }

        // Cinebench R23 estimation
        let cinebenchScore = 0;
        if (cpu) {
            cinebenchScore = Math.round(cpu.cores * cpu.boostClock * 1000); // Rough estimation
        }

        // 3DMark Time Spy estimation
        let timespyScore = 0;
        if (cpu && gpu) {
            const cpuContrib = cpu.cores * cpu.boostClock * 500;
            const gpuContrib = (gpu.performance?.gaming || 0) * 150;
            timespyScore = Math.round(cpuContrib + gpuContrib);
        }

        document.getElementById('cyberpunk-fps').textContent = cyberpunkFps > 0 ? `${cyberpunkFps} FPS` : '-- FPS';
        document.getElementById('cinebench-score').textContent = cinebenchScore > 0 ? `${cinebenchScore.toLocaleString()} pts` : '-- pts';
        document.getElementById('timespy-score').textContent = timespyScore > 0 ? `${timespyScore.toLocaleString()} pts` : '-- pts';

        // Update gaming performance
        const gamingBar = document.getElementById('gaming-performance');
        const gamingScore = document.getElementById('gaming-score');
        if (gamingBar && gamingScore) {
            gamingBar.style.width = `${performance.gaming}%`;
            gamingBar.style.transition = 'width 0.5s ease';
            gamingScore.textContent = `${Math.round(performance.gaming)}/100`;
        }

        // Update productivity performance
        const productivityBar = document.getElementById('productivity-performance');
        const productivityScore = document.getElementById('productivity-score');
        if (productivityBar && productivityScore) {
            productivityBar.style.width = `${performance.productivity}%`;
            productivityBar.style.transition = 'width 0.5s ease';
            productivityScore.textContent = `${Math.round(performance.productivity)}/100`;
        }
    }
}

// Initialize the application
let pcBuilder;
document.addEventListener('DOMContentLoaded', () => {
    pcBuilder = new PCBuilderApp();

    // Auto-save every 30 seconds
    setInterval(() => {
        pcBuilder.saveToStorage();
    }, 30000);

    // Save on page unload
    window.addEventListener('beforeunload', () => {
        pcBuilder.saveToStorage();
    });
});