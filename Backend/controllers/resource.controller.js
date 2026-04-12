import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resource } from "../models/resource.model.js";

export const getResources = asyncHandler(async (req, res) => {
    const { city, category } = req.query;
    
    
    let queryArgs = {};
    
    if (city) {
     
        queryArgs.city = { $regex: city, $options: "i" };
    }
    
    if (category) {
       
        queryArgs.category = category;
    }
    const resources = await Resource.find(queryArgs);
    return res.status(200).json(
        new ApiResponse(200, resources, "Resources fetched successfully")
    );
});

export const addResource = asyncHandler(async (req, res) => {
    const { name, fullAddress, city, contactNumber, category, mapUrl } = req.body;
    
    if (!name || !fullAddress || !city || !category) {
        throw new ApiError(400, "Name, fullAddress, city, and category are required");
    }
    
    const validCategories = ["NGO", "Shelter", "Legal", "Medical"];
    if (!validCategories.includes(category)) {
        throw new ApiError(400, "Invalid category. Must be one of: NGO, Shelter, Legal, Medical");
    }
    
    const resource = await Resource.create({
        name,
        fullAddress,
        city,
        contactNumber,
        category,
        mapUrl
    });
    
    return res.status(201).json(
        new ApiResponse(201, resource, "Resource added successfully")
    );
});

export const deleteResource = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const resource = await Resource.findByIdAndDelete(id);
    
    if (!resource) {
        throw new ApiError(404, "Resource not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Resource deleted successfully")
    );
});
