import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Regions
    console.log('Creating regions...');
    const maputo = await prisma.region.upsert({
        where: { id: 1 },
        update: {},
        create: { province: 'Maputo Cidade', city: 'Maputo', area: 'Centro' }
    });
    const matola = await prisma.region.upsert({
        where: { id: 2 },
        update: {},
        create: { province: 'Maputo Província', city: 'Matola', area: 'Zona Industrial' }
    });
    const beira = await prisma.region.upsert({
        where: { id: 3 },
        update: {},
        create: { province: 'Sofala', city: 'Beira', area: 'Porto' }
    });

    // 2. Clear existing vehicles (optional, but good for fresh seed)
    // await prisma.vehicle.deleteMany();

    // 3. Create Vehicles
    console.log('Creating Corporate Fleet...');
    
    const vehicles = [
        {
            brand: 'Toyota',
            model: 'Coaster',
            year: 2023,
            category: 'Minibus Standard',
            transmission: 'Manual',
            fuelType: 'Diesel',
            seats: 30,
            pricePerDay: 15000,
            description: 'Minibus robusto e confiável, ideal para transporte regular de colaboradores.',
            features: 'Ar Condicionado, Cintos de Segurança 3 pontos, Rádio AM/FM, Extintor, Kit Primeiros Socorros',
            idealFor: 'Transporte de colaboradores, rotas urbanas longas',
            images: ['/vehicle_coaster_1777963779464.png']
        },
        {
            brand: 'Toyota',
            model: 'Hiace',
            year: 2024,
            category: 'Van Standard',
            transmission: 'Manual',
            fuelType: 'Diesel',
            seats: 15,
            pricePerDay: 8500,
            description: 'Van versátil e econômica para transporte ágil de pequenas equipas.',
            features: 'Ar Condicionado, Vidros Elétricos, Fecho Central, ABS',
            idealFor: 'Equipas técnicas, deslocações rápidas',
            images: ['/vehicle_hiace_1777963755414.png']
        },
        {
            brand: 'Iveco',
            model: 'Daily Minibus',
            year: 2023,
            category: 'Minibus Executivo',
            transmission: 'Automática',
            fuelType: 'Diesel',
            seats: 22,
            pricePerDay: 18000,
            description: 'Conforto superior e segurança avançada para transporte corporativo premium.',
            features: 'Ar Condicionado Individual, Assentos Reclináveis, Wi-Fi a bordo, Tomadas USB, Suspensão Pneumática',
            idealFor: 'Transporte executivo, visitas a fábricas, eventos corporativos',
            images: ['/vehicle_iveco_1777963854335.png']
        },
        {
            brand: 'Nissan',
            model: 'NV350 Urvan',
            year: 2023,
            category: 'Van Standard',
            transmission: 'Manual',
            fuelType: 'Diesel',
            seats: 16,
            pricePerDay: 8000,
            description: 'Espaçosa e resistente, perfeita para o dia a dia das operações empresariais.',
            features: 'Ar Condicionado Traseiro, Direção Assistida, Airbags Duplos',
            idealFor: 'Equipas operacionais, transporte de turnos',
            images: ['/vehicle_nv350_1777963796495.png']
        },
        {
            brand: 'Mitsubishi',
            model: 'Rosa',
            year: 2022,
            category: 'Minibus Standard',
            transmission: 'Manual',
            fuelType: 'Diesel',
            seats: 29,
            pricePerDay: 14500,
            description: 'Excelente durabilidade e custo-benefício para rotas industriais.',
            features: 'Porta Automática, Cortinas, Ar Condicionado Central',
            idealFor: 'Transporte industrial, zonas periféricas',
            images: ['/vehicle_rosa_1777963810409.png']
        }
    ];

    for (const v of vehicles) {
        // Upsert by brand and model to avoid duplicates on re-seed
        let vehicle = await prisma.vehicle.findFirst({
            where: { brand: v.brand, model: v.model }
        });

        if (!vehicle) {
            vehicle = await prisma.vehicle.create({
                data: {
                    brand: v.brand,
                    model: v.model,
                    year: v.year,
                    category: v.category,
                    transmission: v.transmission,
                    fuelType: v.fuelType,
                    seats: v.seats,
                    pricePerDay: v.pricePerDay,
                    description: v.description,
                    features: v.features,
                    idealFor: v.idealFor,
                    images: {
                        create: v.images.map((url, idx) => ({
                            url,
                            isPrimary: idx === 0
                        }))
                    },
                    regions: {
                        create: [
                            { regionId: maputo.id },
                            { regionId: matola.id }
                        ]
                    }
                }
            });
            console.log(`Created ${v.brand} ${v.model}`);
        } else {
            console.log(`Vehicle ${v.brand} ${v.model} already exists.`);
        }
    }

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
