import type { Request, Response } from 'express';
import * as userService from '../../services/User/userService';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch {
        res.status(500).json({ message: 'Erro ao buscar usuarios.' });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).json({ message: 'ID invalido.' });
        return;
    }

    try {
        const user = await userService.getById(id);

        if (!user) {
            res.status(404).json({ message: 'Usuario nao encontrado.' });
            return;
        }

        res.status(200).json(user);
    } catch {
        res.status(500).json({ message: 'Erro ao buscar usuario.' });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const newUser = await userService.create(req.body);
        res.status(201).json(newUser);
    } catch {
        res.status(500).json({ message: 'Erro ao criar usuario.' });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).json({ message: 'ID invalido.' });
        return;
    }

    try {
        const updatedUser = await userService.update(id, req.body);
        res.status(200).json(updatedUser);
    } catch {
        res.status(500).json({ message: 'Erro ao atualizar usuario.' });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).json({ message: 'ID invalido.' });
        return;
    }

    try {
        const deletedUser = await userService.remove(id);
        res.status(200).json(deletedUser);
    } catch {
        res.status(500).json({ message: 'Erro ao remover usuario.' });
    }
};

export const getByEmail = async (req: Request, res: Response): Promise<void> => {
    const email = String(req.query.email ?? '');

    if (!email) {
        res.status(400).json({ message: 'Email e obrigatorio.' });
        return;
    }

    try {
        const user = await userService.getByEmail(email);

        if (!user) {
            res.status(404).json({ message: 'Usuario nao encontrado.' });
            return;
        }

        res.status(200).json(user);
    } catch {
        res.status(500).json({ message: 'Erro ao buscar usuario por email.' });
    }
};
