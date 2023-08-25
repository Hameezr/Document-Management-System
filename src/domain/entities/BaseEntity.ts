import { v4 as uuidv4 } from 'uuid';

export interface IEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class BaseEntity implements IEntity {
    protected _id: string;
    protected _createdAt: Date;
    protected _updatedAt: Date;

    protected constructor() {
        this._id = uuidv4()
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    get id(): string {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    protected setId(id: string) {
        this._id = id;
    }    

    protected _copyBaseProps(other: Readonly<IEntity>) {
        this._id = other.id;
        this._createdAt = other.createdAt;
        this._updatedAt = other.updatedAt;
    }

    abstract serialize(): IEntity;
}
