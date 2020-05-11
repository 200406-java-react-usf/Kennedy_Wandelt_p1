export interface CrudRepository<T> {
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T>;
    save(newObj: T): Promise<T>;
    deleteById(id: number): Promise<boolean>
}