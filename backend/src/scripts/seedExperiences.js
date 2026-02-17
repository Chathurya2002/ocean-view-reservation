const mongoose = require("mongoose");
const Experience = require("../models/Experience");
require("dotenv").config();
const connectDB = require("../config/db");

const experiencesData = [
    {
        name: "Galle Fort Sunset Walk & Street Food",
        category: "CULTURAL",
        price: 4500,
        duration: "2 Hours",
        desc: "Walk through the historic Dutch ramparts as the sun dips into the Indian Ocean, followed by authentic Isso Wade (prawn fritters) and Ceylon tea.",
        includes: ["Guided tour", "Street food snacks", "Boutique tea session"],
        notes: "Bring comfortable walking shoes and your camera for the best sunset shots.",
        image: "https://images.unsplash.com/photo-1590680309322-9a3b680746e3?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Mirissa Blue Whale Safari",
        category: "WATER_ACTIVITY",
        price: 18000,
        duration: "Half Day",
        desc: "Set sail from Mirissa harbor to witness the majesty of the Blue Whale, the largest creature on Earth, in its natural Serendib playground.",
        includes: ["Boat transfer", "Breakfast on board", "Life jackets", "Naturalist guide"],
        notes: "Seasonal (Nov - April). Early morning departure (6:30 AM).",
        image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Ayurvedic 'Ayubowan' Healing Ritual",
        category: "WELLNESS",
        price: 12500,
        duration: "90 Minutes",
        desc: "A deeply restorative Shirodhara oil treatment and Pinda Sweda herbal massage using centuries-old Sri Lankan healing techniques.",
        includes: ["Shirodhara treatment", "Herbal steam bath", "Detox tea"],
        notes: "Best experienced in the late afternoon for maximum relaxation.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Cinnamon Island Canoe Voyage",
        category: "NATURE",
        price: 5500,
        duration: "3 Hours",
        desc: "Paddle through the serene waters of Koggala Lake to a hidden island where traditional families peel aromatic cinnamon for generations.",
        includes: ["Canoe rental", "Cinnamon peeling demo", "Fresh juice"],
        notes: "Family-friendly. Hat and sunscreen recommended.",
        image: "https://images.unsplash.com/photo-1444491741275-3747c33cc99b?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Stilt Fisherman Heritage Photo Op",
        category: "CULTURAL",
        price: 3000,
        duration: "1 Hour",
        desc: "Witness the iconic 'Ritipanna' stilt fishing at Ahangama and learn the balance of this dying art form during the golden hour.",
        includes: ["Meeting the fishermen", "Photo permission", "Local guide"],
        notes: "Traditional tips for the fishermen are included in the price.",
        image: "https://images.unsplash.com/photo-1529154691717-3306083d869e?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Private Candlelit Seafood Dinner",
        category: "FOOD_EXPERIENCE",
        price: 32000,
        duration: "Full Evening",
        desc: "A romantic beachfront setup under the stars featuring jumbo prawns, Modha fish, and lagoon crabs paired with premium wine.",
        includes: ["6-course seafood menu", "Private butler", "Beach setup", "Bottle of wine"],
        notes: "Romantic/Couple focused. Advance booking required 24h prior.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Hikkaduwa Turtle Hatchery & Snorkel",
        category: "WATER_ACTIVITY",
        price: 7500,
        duration: "4 Hours",
        desc: "Visit a conservation sanctuary for endangered sea turtles before snorkeling in the vibrant Hikkaduwa coral gardens.",
        includes: ["Sanctuary entry", "Snorkeling gear", "Boat hire", "Refreshments"],
        notes: "Family-friendly. Please do not touch the corals or the turtles.",
        image: "https://images.unsplash.com/photo-1544344823-1601e7969a31?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Madol Duwa Mangrove Safari",
        category: "NATURE",
        price: 8500,
        duration: "3 Hours",
        desc: "Explore the mystical Madu River mangroves, navigate through tunnels of green, and experience a unique natural fish therapy.",
        includes: ["Motorboat tour", "Fish spa experience", "Island temple visit"],
        notes: "Great for families and groups. Life jackets provided.",
        image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Sunrise Yoga on the Ramparts",
        category: "WELLNESS",
        price: 4000,
        duration: "75 Minutes",
        desc: "Start your day with a mindful Vinyasa flow atop the Galle Fort walls, overlooking the crashing waves and old lighthouse.",
        includes: ["Yoga mat rental", "Water", "Professional instructor"],
        notes: "All levels welcome. Starts at 6:15 AM.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Lighthouse Romantic Picnic",
        category: "FOOD_EXPERIENCE",
        price: 15000,
        duration: "3 Hours",
        desc: "An elegant hamper filled with local delicacies, artisanal cheese, and tropical fruits served on a secluded cliffside near Rumassala.",
        includes: ["Picnic hamper", "Luxury blanket setup", "Chilled juice/cider"],
        notes: "Romantic/Couple focused. Best during the cooler 'velvet hour' (4:30 PM).",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
    }
];

const seedExperiences = async () => {
    try {
        await connectDB();
        await Experience.deleteMany({});
        await Experience.insertMany(experiencesData);
        console.log("Experiences seeded successfully! 🌱");
        process.exit();
    } catch (err) {
        console.error("Error seeding experiences:", err);
        process.exit(1);
    }
};

seedExperiences();
