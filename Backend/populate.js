import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import { Resource } from "./models/resource.model.js";

const populateResources = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        if (uri.endsWith('/')) uri = uri.slice(0, -1);
        if (!uri.includes('?')) {
            const parts = uri.split('/');
            if (parts.length < 4) uri = `${uri}/${DB_NAME}`;
        }
        await mongoose.connect(uri);
        console.log("Connected to DB");

       
        await Resource.deleteMany({});

        await Resource.insertMany([
            {
                name: "Delhi Women's Help NGO",
                fullAddress: "123 Safdarjung Enclave, New Delhi, Delhi 110029",
                city: "Delhi",
                contactNumber: "011-2334455",
                category: "NGO",
                mapUrl: "https://maps.google.com/?q=Delhi"
            },
            {
                name: "Delhi Legal Defense Clinic",
                fullAddress: "45 Court Road, New Delhi, Delhi 110001",
                city: "Delhi",
                contactNumber: "011-9988776",
                category: "Legal",
                mapUrl: "https://maps.google.com/?q=Court"
            },
            {
                name: "Mumbai Safe Shelter",
                fullAddress: "14 Andheri West, Mumbai, Maharashtra",
                city: "Mumbai",
                contactNumber: "022-11223344",
                category: "Shelter",
                mapUrl: "https://maps.google.com/?q=14+Andheri+West,+Mumbai"
            },
            {
                name: "Mumbai Counseling Center",
                fullAddress: "88 Bandra Reclamation, Mumbai, Maharashtra",
                city: "Mumbai",
                contactNumber: "022-55667788",
                category: "Medical",
                mapUrl: "https://maps.google.com/?q=88+Bandra+Reclamation,+Mumbai"
            },
            {
                name: "Lucknow Asha NGO",
                fullAddress: "Gomti Nagar Phase 1, Lucknow, UP",
                city: "Lucknow",
                contactNumber: "0522-2304050",
                category: "NGO",
                mapUrl: "https://maps.google.com/?q=Gomti+Nagar+Phase+1,+Lucknow"
            },
            {
                name: "Lucknow Legal Aid",
                fullAddress: "Hazratganj, Lucknow, UP",
                city: "Lucknow",
                contactNumber: "0522-2201122",
                category: "Legal",
                mapUrl: "https://maps.google.com/?q=Hazratganj,+Lucknow"
            }
        ]);

        console.log("Resources populated successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error populating resources:", err);
        process.exit(1);
    }
};

populateResources();
