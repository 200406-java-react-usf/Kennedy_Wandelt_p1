export interface CrudRepository<T> {
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T>;
    save(newObj: any): Promise<T>;
    deleteById(id: number): Promise<boolean>
}