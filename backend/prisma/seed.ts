import { PrismaClient, Role, AvailabilityStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { phone: '+258840000000' },
        update: {},
        create: {
            name: 'Administrador',
            email: 'admin@rentacar.co.mz',
            phone: '+258840000000',
            password: adminPassword,
            role: Role.ADMIN,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create sample client
    const clientPassword = await bcrypt.hash('cliente123', 10);
    const client = await prisma.user.upsert({
        where: { phone: '+258841111111' },
        update: {},
        create: {
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '+258841111111',
            password: clientPassword,
            role: Role.CLIENT,
        },
    });
    console.log('✅ Sample client created:', client.email);

    // Mozambique regions
    const regionsData = [
        { province: 'Maputo', city: 'Maputo', area: 'Centro' },
        { province: 'Maputo', city: 'Maputo', area: 'Aeroporto' },
        { province: 'Maputo', city: 'Matola', area: 'Centro' },
        { province: 'Gaza', city: 'Xai-Xai', area: 'Centro' },
        { province: 'Gaza', city: 'Chókwè', area: null },
        { province: 'Inhambane', city: 'Inhambane', area: 'Centro' },
        { province: 'Inhambane', city: 'Vilankulo', area: null },
        { province: 'Inhambane', city: 'Tofo', area: 'Praia' },
        { province: 'Sofala', city: 'Beira', area: 'Centro' },
        { province: 'Sofala', city: 'Beira', area: 'Aeroporto' },
        { province: 'Manica', city: 'Chimoio', area: 'Centro' },
        { province: 'Zambézia', city: 'Quelimane', area: 'Centro' },
        { province: 'Tete', city: 'Tete', area: 'Centro' },
        { province: 'Nampula', city: 'Nampula', area: 'Centro' },
        { province: 'Nampula', city: 'Ilha de Moçambique', area: null },
        { province: 'Cabo Delgado', city: 'Pemba', area: 'Centro' },
        { province: 'Niassa', city: 'Lichinga', area: 'Centro' },
    ];

    const regions: Array<{ id: number }> = [];
    for (const r of regionsData) {
        const region = await prisma.region.create({ data: r });
        regions.push(region);
    }
    console.log(`✅ ${regions.length} regions created`);

    // Sample vehicles
    const vehiclesData = [
        {
            brand: 'Toyota',
            model: 'Hilux 2.8 GD-6',
            year: 2024,
            category: 'SUV',
            transmission: 'Automática',
            fuelType: 'Diesel',
            seats: 5,
            pricePerDay: 8500.0,
            description: 'Toyota Hilux robusta, ideal para estradas moçambicanas. 4x4 com ar condicionado e Bluetooth.',
            features: 'Ar condicionado,4x4,Bluetooth,USB,Airbags,Câmera de ré',
        },
        {
            brand: 'Toyota',
            model: 'Corolla Cross',
            year: 2024,
            category: 'SUV',
            transmission: 'Automática',
            fuelType: 'Gasolina',
            seats: 5,
            pricePerDay: 7500.0,
            description: 'Corolla Cross confortável para viagens urbanas e interprovinciais.',
            features: 'Ar condicionado,Bluetooth,Cruise Control,Airbags,Ecrã táctil',
        },
        {
            brand: 'Hyundai',
            model: 'Tucson',
            year: 2023,
            category: 'SUV',
            transmission: 'Automática',
            fuelType: 'Gasolina',
            seats: 5,
            pricePerDay: 7000.0,
            description: 'Hyundai Tucson espaçoso e eficiente. Perfeito para famílias.',
            features: 'Ar condicionado,Bluetooth,Sensores de estacionamento,Teto panorâmico',
        },
        {
            brand: 'Toyota',
            model: 'Avanza',
            year: 2023,
            category: 'Minivan',
            transmission: 'Manual',
            fuelType: 'Gasolina',
            seats: 7,
            pricePerDay: 5000.0,
            description: 'Toyota Avanza para grupos. 7 lugares com espaço para bagagem.',
            features: 'Ar condicionado,7 lugares,Espaço para bagagem',
        },
        {
            brand: 'Suzuki',
            model: 'Swift',
            year: 2024,
            category: 'Económico',
            transmission: 'Manual',
            fuelType: 'Gasolina',
            seats: 5,
            pricePerDay: 3500.0,
            description: 'Suzuki Swift compacto e económico. Ideal para deslocações urbanas em Maputo.',
            features: 'Ar condicionado,Bluetooth,Baixo consumo',
        },
        {
            brand: 'Mercedes-Benz',
            model: 'Classe E',
            year: 2024,
            category: 'Luxo',
            transmission: 'Automática',
            fuelType: 'Gasolina',
            seats: 5,
            pricePerDay: 15000.0,
            description: 'Mercedes-Benz Classe E. Luxo e sofisticação para executivos e ocasiões especiais.',
            features: 'Ar condicionado,Bancos em couro,Sistema de navegação,Teto solar,Câmera 360°',
        },
    ];

    const vehicles: Array<{ id: number }> = [];
    for (const v of vehiclesData) {
        const vehicle = await prisma.vehicle.create({ data: v });
        vehicles.push(vehicle);
    }
    console.log(`✅ ${vehicles.length} vehicles created`);

    // Vehicle images (real Unsplash placeholders)
    const vehicleImages = [
        ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80'],
        ['https://images.unsplash.com/photo-1622199671151-54bc7b94dc15?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1503375894170-ff6bd37e69f8?auto=format&fit=crop&q=80'],
        ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80'],
        ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80'],
        ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80'],
        ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80']
    ];

    for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];
        const imagesForVehicle = vehicleImages[i % vehicleImages.length];

        await prisma.vehicleImage.create({
            data: {
                vehicleId: vehicle.id,
                url: imagesForVehicle[0],
                isPrimary: true,
            },
        });
        await prisma.vehicleImage.create({
            data: {
                vehicleId: vehicle.id,
                url: imagesForVehicle[1],
                isPrimary: false,
            },
        });
    }
    console.log('✅ Vehicle images created');

    // Associate vehicles with regions
    // Maputo center region (index 0)
    for (const vehicle of vehicles) {
        await prisma.vehicleRegion.create({
            data: { vehicleId: vehicle.id, regionId: regions[0].id },
        });
    }
    // Some vehicles also in Beira
    await prisma.vehicleRegion.create({
        data: { vehicleId: vehicles[0].id, regionId: regions[8].id },
    });
    await prisma.vehicleRegion.create({
        data: { vehicleId: vehicles[3].id, regionId: regions[8].id },
    });
    console.log('✅ Vehicle-region associations created');

    // Vehicle availability (next 60 days from now)
    const today = new Date();
    for (const vehicle of vehicles) {
        for (let d = 0; d < 60; d++) {
            const date = new Date(today);
            date.setDate(date.getDate() + d);
            date.setHours(0, 0, 0, 0);
            await prisma.vehicleAvailability.create({
                data: {
                    vehicleId: vehicle.id,
                    date,
                    status: AvailabilityStatus.AVAILABLE,
                },
            });
        }
    }
    console.log('✅ Vehicle availability created (60 days)');

    // Transfer services
    const shuttle = await prisma.transferService.create({
        data: {
            name: 'Shuttle Executivo',
            description: 'Serviço de transfer em veículo executivo com motorista profissional.',
            vehicleType: 'Sedan Executivo',
            capacity: 3,
        },
    });

    const van = await prisma.transferService.create({
        data: {
            name: 'Van Transfer',
            description: 'Transfer em van espaçosa para grupos e famílias.',
            vehicleType: 'Van 12 lugares',
            capacity: 10,
        },
    });

    const luxury = await prisma.transferService.create({
        data: {
            name: 'Transfer Premium',
            description: 'Transfer de luxo em Mercedes ou BMW para executivos.',
            vehicleType: 'Mercedes Classe S',
            capacity: 3,
        },
    });
    console.log('✅ Transfer services created');

    console.log('\n🎉 Seed complete!');
    console.log('📧 Admin: admin@rentacar.co.mz / admin123');
    console.log('📧 Client: joao@email.com / cliente123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
