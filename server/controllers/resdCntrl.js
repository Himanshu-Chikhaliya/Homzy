import asyncHandler from 'express-async-handler'

import { prisma } from '../config/prismaConfig.js'

export const createResidency = asyncHandler(async (req, res) => {
    const { title, description, price, address, city, country, image, facilities, userEmail } = req.body.data

    console.log(req.body.data);
    try {
        const residency = await prisma.residency.create({
            data: {
                title, description, price, address, city, country, image, facilities, owner: { connect: { email: userEmail } }
            }
        })

        res.send({ message: "Residency created successfully", residency })
    } catch (err) {
        if (err.code === "P2002") {
            throw new Error("A residency with address already there")
        }
        throw new Error(err.message)
    }
});

export const getAllResidencies = asyncHandler(async (req, res) => {
    const residencies = await prisma.residency.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.send(residencies);
});

export const getResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const residency = await prisma.residency.findUnique({
            where: { id }
        })
        res.send(residency)
    } catch (err) {
        throw new Error(err.message);
    }
})

export const removeResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const residency = await prisma.residency.findUnique({
            where: { id },
        });

        if (residency.userEmail === email) {
            await prisma.residency.delete({
                where: { id },
            });
            res.send({ message: "Residency deleted successfully" });
        } else {
            res.status(401).send({ message: "You are not authorized to delete this residency" });
        }
    } catch (err) {
        throw new Error(err.message);
    }
});