// Comprehensive PC Components Database
const COMPONENTS_DATABASE = {
    cpu: [
        {
            id: 'cpu-1',
            name: 'Intel Core i9-13900K',
            brand: 'Intel',
            socket: 'LGA1700',
            cores: 24,
            threads: 32,
            baseClock: 3.0,
            boostClock: 5.8,
            tdp: 125,
            price: 589,
            performance: {
                gaming: 95,
                productivity: 98
            },
            specs: {
                architecture: '13th Gen Raptor Lake',
                processNode: '10nm',
                cache: '36MB L3',
                integratedGraphics: 'Intel UHD Graphics 770',
                memorySupport: 'DDR4-3200, DDR5-5600'
            }
        },
        {
            id: 'cpu-2',
            name: 'AMD Ryzen 9 7950X',
            brand: 'AMD',
            socket: 'AM5',
            cores: 16,
            threads: 32,
            baseClock: 4.5,
            boostClock: 5.7,
            tdp: 170,
            price: 699,
            performance: {
                gaming: 92,
                productivity: 100
            },
            specs: {
                architecture: 'Zen 4',
                processNode: '5nm',
                cache: '64MB L3',
                integratedGraphics: 'Radeon Graphics',
                memorySupport: 'DDR5-5200'
            }
        },
        {
            id: 'cpu-3',
            name: 'Intel Core i5-13600K',
            brand: 'Intel',
            socket: 'LGA1700',
            cores: 14,
            threads: 20,
            baseClock: 3.5,
            boostClock: 5.1,
            tdp: 125,
            price: 319,
            performance: {
                gaming: 88,
                productivity: 85
            },
            specs: {
                architecture: '13th Gen Raptor Lake',
                processNode: '10nm',
                cache: '24MB L3',
                integratedGraphics: 'Intel UHD Graphics 770',
                memorySupport: 'DDR4-3200, DDR5-5600'
            }
        },
        {
            id: 'cpu-4',
            name: 'AMD Ryzen 5 7600X',
            brand: 'AMD',
            socket: 'AM5',
            cores: 6,
            threads: 12,
            baseClock: 4.7,
            boostClock: 5.3,
            tdp: 105,
            price: 299,
            performance: {
                gaming: 85,
                productivity: 78
            },
            specs: {
                architecture: 'Zen 4',
                processNode: '5nm',
                cache: '32MB L3',
                integratedGraphics: 'Radeon Graphics',
                memorySupport: 'DDR5-5200'
            }
        }
    ],
    
    gpu: [
        {
            id: 'gpu-1',
            name: 'NVIDIA RTX 4090',
            brand: 'NVIDIA',
            vram: 24,
            vramType: 'GDDR6X',
            baseClock: 2230,
            boostClock: 2520,
            tdp: 450,
            price: 1599,
            performance: {
                gaming: 100,
                productivity: 95
            },
            specs: {
                architecture: 'Ada Lovelace',
                processNode: '4nm',
                cudaCores: 16384,
                rtCores: 128,
                tensorCores: 512,
                displayOutputs: '3x DisplayPort 1.4a, 1x HDMI 2.1',
                powerConnectors: '3x 8-pin PCIe'
            }
        },
        {
            id: 'gpu-2',
            name: 'AMD RX 7900 XTX',
            brand: 'AMD',
            vram: 24,
            vramType: 'GDDR6',
            baseClock: 1855,
            boostClock: 2500,
            tdp: 355,
            price: 999,
            performance: {
                gaming: 90,
                productivity: 82
            },
            specs: {
                architecture: 'RDNA 3',
                processNode: '5nm',
                streamProcessors: 6144,
                rayAccelerators: 96,
                infinityCache: '96MB',
                displayOutputs: '2x DisplayPort 2.1, 2x HDMI 2.1',
                powerConnectors: '2x 8-pin PCIe'
            }
        },
        {
            id: 'gpu-3',
            name: 'NVIDIA RTX 4070',
            brand: 'NVIDIA',
            vram: 12,
            vramType: 'GDDR6X',
            baseClock: 1920,
            boostClock: 2475,
            tdp: 200,
            price: 599,
            performance: {
                gaming: 78,
                productivity: 75
            },
            specs: {
                architecture: 'Ada Lovelace',
                processNode: '4nm',
                cudaCores: 5888,
                rtCores: 46,
                tensorCores: 184,
                displayOutputs: '3x DisplayPort 1.4a, 1x HDMI 2.1',
                powerConnectors: '1x 12-pin PCIe (adapter included)'
            }
        },
        {
            id: 'gpu-4',
            name: 'AMD RX 7600',
            brand: 'AMD',
            vram: 8,
            vramType: 'GDDR6',
            baseClock: 1720,
            boostClock: 2655,
            tdp: 165,
            price: 269,
            performance: {
                gaming: 65,
                productivity: 58
            },
            specs: {
                architecture: 'RDNA 3',
                processNode: '6nm',
                streamProcessors: 2048,
                rayAccelerators: 32,
                infinityCache: '32MB',
                displayOutputs: '2x DisplayPort 2.1, 2x HDMI 2.1',
                powerConnectors: '1x 8-pin PCIe'
            }
        }
    ],
    
    motherboard: [
        {
            id: 'mb-1',
            name: 'ASUS ROG MAXIMUS Z790 HERO',
            brand: 'ASUS',
            socket: 'LGA1700',
            chipset: 'Z790',
            formFactor: 'ATX',
            ramSlots: 4,
            maxRam: 128,
            ramType: 'DDR5',
            price: 629,
            specs: {
                pciSlots: '1x PCIe 5.0 x16, 1x PCIe 4.0 x16, 1x PCIe 3.0 x16',
                m2Slots: '4x M.2 (PCIe 4.0)',
                sataConnectors: '6x SATA 6Gb/s',
                usbPorts: '10x USB-A, 4x USB-C',
                networking: 'Intel WiFi 6E, 2.5Gb Ethernet',
                audio: 'SupremeFX 7.1',
                dimensions: '305 x 244mm'
            }
        },
        {
            id: 'mb-2',
            name: 'MSI MAG X670E TOMAHAWK',
            brand: 'MSI',
            socket: 'AM5',
            chipset: 'X670E',
            formFactor: 'ATX',
            ramSlots: 4,
            maxRam: 128,
            ramType: 'DDR5',
            price: 399,
            specs: {
                pciSlots: '2x PCIe 5.0 x16, 1x PCIe 4.0 x16',
                m2Slots: '4x M.2 (PCIe 4.0)',
                sataConnectors: '6x SATA 6Gb/s',
                usbPorts: '8x USB-A, 2x USB-C',
                networking: 'WiFi 6E, 2.5Gb Ethernet',
                audio: 'Realtek ALC4080',
                dimensions: '305 x 244mm'
            }
        },
        {
            id: 'mb-3',
            name: 'GIGABYTE B760M AORUS ELITE',
            brand: 'GIGABYTE',
            socket: 'LGA1700',
            chipset: 'B760',
            formFactor: 'mATX',
            ramSlots: 4,
            maxRam: 128,
            ramType: 'DDR4',
            price: 159,
            specs: {
                pciSlots: '1x PCIe 4.0 x16, 2x PCIe 3.0 x1',
                m2Slots: '2x M.2 (PCIe 4.0)',
                sataConnectors: '4x SATA 6Gb/s',
                usbPorts: '6x USB-A, 2x USB-C',
                networking: 'WiFi 6, Gigabit Ethernet',
                audio: 'Realtek ALC897',
                dimensions: '244 x 244mm'
            }
        }
    ],
    
    ram: [
        {
            id: 'ram-1',
            name: 'Corsair Dominator Platinum RGB 32GB',
            brand: 'Corsair',
            capacity: 32,
            speed: 6000,
            type: 'DDR5',
            sticks: 2,
            latency: 'CL36',
            voltage: 1.35,
            price: 459,
            specs: {
                timings: '36-38-38-84',
                jedec: 'JEDEC Compliant',
                xmp: 'XMP 3.0',
                heatspreader: 'Aluminum',
                rgb: 'Yes',
                warranty: 'Lifetime'
            }
        },
        {
            id: 'ram-2',
            name: 'G.SKILL Trident Z5 RGB 32GB',
            brand: 'G.SKILL',
            capacity: 32,
            speed: 5600,
            type: 'DDR5',
            sticks: 2,
            latency: 'CL36',
            voltage: 1.25,
            price: 329,
            specs: {
                timings: '36-36-36-96',
                jedec: 'JEDEC Compliant',
                xmp: 'XMP 3.0',
                heatspreader: 'Aluminum',
                rgb: 'Yes',
                warranty: 'Lifetime'
            }
        },
        {
            id: 'ram-3',
            name: 'Corsair Vengeance LPX 32GB',
            brand: 'Corsair',
            capacity: 32,
            speed: 3200,
            type: 'DDR4',
            sticks: 2,
            latency: 'CL16',
            voltage: 1.35,
            price: 179,
            specs: {
                timings: '16-18-18-36',
                jedec: 'JEDEC Compliant',
                xmp: 'XMP 2.0',
                heatspreader: 'Aluminum',
                rgb: 'No',
                warranty: 'Lifetime'
            }
        },
        {
            id: 'ram-4',
            name: 'Kingston Fury Beast 16GB',
            brand: 'Kingston',
            capacity: 16,
            speed: 3200,
            type: 'DDR4',
            sticks: 2,
            latency: 'CL16',
            voltage: 1.35,
            price: 89,
            specs: {
                timings: '16-18-18-36',
                jedec: 'JEDEC Compliant',
                xmp: 'XMP 2.0',
                heatspreader: 'Aluminum',
                rgb: 'No',
                warranty: 'Lifetime'
            }
        }
    ],
    
    storage: [
        {
            id: 'storage-1',
            name: 'Samsung 980 PRO 2TB',
            brand: 'Samsung',
            capacity: 2000,
            type: 'NVMe SSD',
            interface: 'PCIe 4.0 x4',
            readSpeed: 7000,
            writeSpeed: 5100,
            price: 299,
            specs: {
                formFactor: 'M.2 2280',
                controller: 'Samsung Elpis',
                nandType: 'V-NAND 3bit MLC',
                cache: '2GB LPDDR4',
                endurance: '1200 TBW',
                warranty: '5 Years'
            }
        },
        {
            id: 'storage-2',
            name: 'WD Black SN850X 1TB',
            brand: 'Western Digital',
            capacity: 1000,
            type: 'NVMe SSD',
            interface: 'PCIe 4.0 x4',
            readSpeed: 7300,
            writeSpeed: 6600,
            price: 179,
            specs: {
                formFactor: 'M.2 2280',
                controller: 'WD_BLACK G2',
                nandType: 'BiCS5 112L 3D TLC',
                cache: '1GB DDR4',
                endurance: '600 TBW',
                warranty: '5 Years'
            }
        },
        {
            id: 'storage-3',
            name: 'Seagate Barracuda 2TB HDD',
            brand: 'Seagate',
            capacity: 2000,
            type: 'HDD',
            interface: 'SATA 6Gb/s',
            readSpeed: 180,
            writeSpeed: 180,
            price: 69,
            specs: {
                formFactor: '3.5"',
                rpm: '7200 RPM',
                cache: '256MB',
                heads: 4,
                platters: 2,
                warranty: '2 Years'
            }
        }
    ],
    
    psu: [
        {
            id: 'psu-1',
            name: 'Corsair RM1000x',
            brand: 'Corsair',
            wattage: 1000,
            efficiency: '80+ Gold',
            modular: 'Fully Modular',
            fanSize: 135,
            price: 199,
            specs: {
                pfc: 'Active PFC',
                rails: 'Single +12V Rail',
                protections: 'OVP, UVP, OCP, OPP, SCP',
                connectors: {
                    motherboard: '1x 24-pin',
                    cpu: '2x 8-pin',
                    pcie: '8x 8-pin',
                    sata: '12x SATA',
                    molex: '4x Molex'
                },
                warranty: '10 Years'
            }
        },
        {
            id: 'psu-2',
            name: 'EVGA SuperNOVA 850 GT',
            brand: 'EVGA',
            wattage: 850,
            efficiency: '80+ Gold',
            modular: 'Fully Modular',
            fanSize: 130,
            price: 149,
            specs: {
                pfc: 'Active PFC',
                rails: 'Single +12V Rail',
                protections: 'OVP, UVP, OCP, OPP, SCP, OTP',
                connectors: {
                    motherboard: '1x 24-pin',
                    cpu: '2x 8-pin',
                    pcie: '6x 8-pin',
                    sata: '10x SATA',
                    molex: '4x Molex'
                },
                warranty: '10 Years'
            }
        },
        {
            id: 'psu-3',
            name: 'Seasonic Focus GX-650',
            brand: 'Seasonic',
            wattage: 650,
            efficiency: '80+ Gold',
            modular: 'Fully Modular',
            fanSize: 120,
            price: 109,
            specs: {
                pfc: 'Active PFC',
                rails: 'Single +12V Rail',
                protections: 'OVP, UVP, OCP, OPP, SCP, OTP',
                connectors: {
                    motherboard: '1x 24-pin',
                    cpu: '1x 8-pin',
                    pcie: '4x 8-pin',
                    sata: '8x SATA',
                    molex: '3x Molex'
                },
                warranty: '10 Years'
            }
        }
    ],
    
    case: [
        {
            id: 'case-1',
            name: 'Fractal Design Define 7',
            brand: 'Fractal Design',
            formFactor: 'Full Tower',
            color: 'Black',
            sidePanel: 'Tempered Glass',
            price: 169,
            specs: {
                dimensions: '543 x 240 x 474mm',
                motherboardSupport: 'ATX, mATX, Mini-ITX',
                maxGpuLength: '440mm',
                maxCpuCoolerHeight: '185mm',
                driveBays: '2x 3.5", 3x 2.5"',
                expansionSlots: 7,
                frontPorts: '2x USB 3.0, 1x USB-C, Audio',
                preInstalledFans: '3x 140mm'
            }
        },
        {
            id: 'case-2',
            name: 'NZXT H7 Flow',
            brand: 'NZXT',
            formFactor: 'Mid Tower',
            color: 'White',
            sidePanel: 'Tempered Glass',
            price: 129,
            specs: {
                dimensions: '465 x 230 x 455mm',
                motherboardSupport: 'ATX, mATX, Mini-ITX',
                maxGpuLength: '400mm',
                maxCpuCoolerHeight: '165mm',
                driveBays: '2x 3.5", 4x 2.5"',
                expansionSlots: 7,
                frontPorts: '1x USB 3.1 Gen 2 Type-C, 2x USB 3.0, Audio',
                preInstalledFans: '3x 120mm'
            }
        },
        {
            id: 'case-3',
            name: 'Cooler Master MasterBox Q300L',
            brand: 'Cooler Master',
            formFactor: 'Mini-ITX',
            color: 'Black',
            sidePanel: 'Acrylic',
            price: 44,
            specs: {
                dimensions: '387 x 230 x 308mm',
                motherboardSupport: 'Mini-ITX',
                maxGpuLength: '360mm',
                maxCpuCoolerHeight: '159mm',
                driveBays: '2x 2.5"',
                expansionSlots: 4,
                frontPorts: '1x USB 3.0, 1x USB 2.0, Audio',
                preInstalledFans: '1x 120mm'
            }
        }
    ],
    
    cooling: [
        {
            id: 'cooling-1',
            name: 'Noctua NH-D15',
            brand: 'Noctua',
            type: 'Air Cooler',
            fanSize: 140,
            height: 165,
            tdpRating: 250,
            price: 109,
            specs: {
                heatpipes: '6x 6mm',
                fans: '2x NF-A15 PWM',
                socketSupport: 'Intel LGA1700, AMD AM5/AM4',
                dimensions: '165 x 150 x 161mm',
                weight: '1320g',
                warranty: '6 Years'
            }
        },
        {
            id: 'cooling-2',
            name: 'Corsair H150i Elite LCD',
            brand: 'Corsair',
            type: 'AIO Liquid Cooler',
            radiatorSize: 360,
            fanSize: 120,
            tdpRating: 300,
            price: 279,
            specs: {
                pumpSpeed: '3400 RPM',
                fans: '3x ML120 RGB PWM',
                tubing: 'Low-permeation rubber',
                socketSupport: 'Intel LGA1700, AMD AM5/AM4',
                dimensions: '397 x 120 x 27mm (radiator)',
                warranty: '5 Years'
            }
        },
        {
            id: 'cooling-3',
            name: 'be quiet! Dark Rock 4',
            brand: 'be quiet!',
            type: 'Air Cooler',
            fanSize: 120,
            height: 159,
            tdpRating: 200,
            price: 74,
            specs: {
                heatpipes: '6x 6mm',
                fans: '1x Silent Wings 3 PWM',
                socketSupport: 'Intel LGA1700, AMD AM5/AM4',
                dimensions: '159 x 136 x 96mm',
                weight: '760g',
                warranty: '3 Years'
            }
        }
    ]
};

// Component compatibility rules
const COMPATIBILITY_RULES = {
    // CPU and Motherboard socket compatibility
    cpuMotherboard: {
        'LGA1700': ['LGA1700'],
        'AM5': ['AM5'],
        'AM4': ['AM4']
    },
    
    // RAM and Motherboard type compatibility
    ramMotherboard: {
        'DDR5': ['DDR5'],
        'DDR4': ['DDR4']
    },
    
    // GPU power requirements (estimated)
    gpuPowerRequirements: {
        'gpu-1': 450, // RTX 4090
        'gpu-2': 355, // RX 7900 XTX
        'gpu-3': 200, // RTX 4070
        'gpu-4': 165  // RX 7600
    },
    
    // CPU power requirements (TDP)
    cpuPowerRequirements: {
        'cpu-1': 125, // i9-13900K
        'cpu-2': 170, // Ryzen 9 7950X
        'cpu-3': 125, // i5-13600K
        'cpu-4': 105  // Ryzen 5 7600X
    },
    
    // Case form factor compatibility
    caseMotherboardCompatibility: {
        'Full Tower': ['ATX', 'mATX', 'Mini-ITX'],
        'Mid Tower': ['ATX', 'mATX', 'Mini-ITX'],
        'Mini-ITX': ['Mini-ITX']
    }
};

// Performance calculation weights
const PERFORMANCE_WEIGHTS = {
    gaming: {
        cpu: 0.25,
        gpu: 0.65,
        ram: 0.05,
        storage: 0.05
    },
    productivity: {
        cpu: 0.50,
        gpu: 0.25,
        ram: 0.15,
        storage: 0.10
    }
};

// Prebuilt PC configurations
const PREBUILT_CONFIGS = {
    budget: {
        name: "Budget Gaming PC",
        description: "Great for 1080p gaming and everyday tasks",
        targetPrice: 800,
        components: {
            cpu: 'cpu-4', // Ryzen 5 7600X
            gpu: 'gpu-4', // RX 7600
            motherboard: 'mb-2', // MSI MAG X670E (AM5 compatible)
            ram: 'ram-2', // G.SKILL Trident Z5 32GB DDR5 (DDR5 compatible)
            storage: 'storage-2', // WD Black SN850X 1TB
            psu: 'psu-3', // Seasonic Focus GX-650
            case: 'case-2', // NZXT H7 Flow
            cooling: 'cooling-3' // be quiet! Dark Rock 4
        }
    },
    
    midRange: {
        name: "Mid-Range Enthusiast",
        description: "Excellent for 1440p gaming and content creation",
        targetPrice: 1500,
        components: {
            cpu: 'cpu-3', // Intel i5-13600K
            gpu: 'gpu-3', // RTX 4070
            motherboard: 'mb-3', // GIGABYTE B760M (LGA1700 compatible)
            ram: 'ram-3', // Corsair Vengeance LPX 32GB DDR4 (DDR4 compatible)
            storage: 'storage-1', // Samsung 980 PRO 2TB
            psu: 'psu-2', // EVGA SuperNOVA 850 GT
            case: 'case-1', // Fractal Design Define 7
            cooling: 'cooling-1' // Noctua NH-D15
        }
    },
    
    highEnd: {
        name: "High-End Beast",
        description: "Ultimate 4K gaming and professional workstation",
        targetPrice: 3500,
        components: {
            cpu: 'cpu-2', // AMD Ryzen 9 7950X
            gpu: 'gpu-1', // NVIDIA RTX 4090
            motherboard: 'mb-2', // MSI MAG X670E (AM5 compatible)
            ram: 'ram-1', // Corsair Dominator Platinum 32GB DDR5
            storage: 'storage-1', // Samsung 980 PRO 2TB
            psu: 'psu-1', // Corsair RM1000x
            case: 'case-1', // Fractal Design Define 7
            cooling: 'cooling-2' // Corsair H150i Elite LCD
        }
    },
    
    workstation: {
        name: "Content Creator Workstation",
        description: "Optimized for video editing, 3D rendering, and streaming",
        targetPrice: 2800,
        components: {
            cpu: 'cpu-1', // Intel i9-13900K
            gpu: 'gpu-2', // AMD RX 7900 XTX
            motherboard: 'mb-1', // ASUS ROG MAXIMUS Z790 (LGA1700 compatible)
            ram: 'ram-1', // Corsair Dominator Platinum 32GB DDR5
            storage: 'storage-1', // Samsung 980 PRO 2TB
            psu: 'psu-2', // EVGA SuperNOVA 850 GT
            case: 'case-1', // Fractal Design Define 7
            cooling: 'cooling-2' // Corsair H150i Elite LCD
        }
    }
};

// Build templates for specific use cases
const BUILD_TEMPLATES = {
    esports: {
        name: "E-Sports Champion",
        focus: "High FPS competitive gaming",
        components: {
            cpu: 'cpu-3',
            gpu: 'gpu-3',
            motherboard: 'mb-3',
            ram: 'ram-4',
            storage: 'storage-2',
            psu: 'psu-3',
            case: 'case-2',
            cooling: 'cooling-3'
        }
    },
    
    streaming: {
        name: "Streaming Setup",
        focus: "Gaming while streaming to Twitch/YouTube",
        components: {
            cpu: 'cpu-1',
            gpu: 'gpu-2',
            motherboard: 'mb-1',
            ram: 'ram-1',
            storage: 'storage-1',
            psu: 'psu-2',
            case: 'case-1',
            cooling: 'cooling-2'
        }
    },
    
    silent: {
        name: "Silent Computing",
        focus: "Minimal noise for quiet environments",
        components: {
            cpu: 'cpu-4',
            gpu: 'gpu-4',
            motherboard: 'mb-2',
            ram: 'ram-2',
            storage: 'storage-1',
            psu: 'psu-3',
            case: 'case-1',
            cooling: 'cooling-3'
        }
    }
};

// Component upgrade suggestions
const UPGRADE_SUGGESTIONS = {
    cpu: {
        budget: ['cpu-4', 'cpu-3'],
        midRange: ['cpu-3', 'cpu-1'],
        highEnd: ['cpu-1', 'cpu-2']
    },
    gpu: {
        budget: ['gpu-4', 'gpu-3'],
        midRange: ['gpu-3', 'gpu-2'],
        highEnd: ['gpu-2', 'gpu-1']
    }
};
