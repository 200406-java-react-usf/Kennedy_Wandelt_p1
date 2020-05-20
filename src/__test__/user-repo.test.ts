import { UserRepo } from '../repos/user-repo';
import * as mockIndex from '..';
import { User } from '../models/user';
import { NewUser } from '../models/newUser'
import { InternalServerError } from '../error/error';

jest.mock('..', ()=> {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

describe('userRepo', () => {

    let sut = new UserRepo();
    let mockConnect = mockIndex.connectionPool.connect;

    
    beforeEach(() => {
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                "ers_user_id": 1,
                                "username": "test",
                                "password": "password",
                                "first_name": "Test",
                                "last_name": "Testerson",
                                "email": "email@email.com",
                                "role_name": "employee"
                            }
                        ]
                    }
                }),
                release: jest.fn()
            }
        });
    });
    

    test('should give an empty array when ther are no records to be retrieved from the data source', async() => {
        expect.hasAssertions();
        //arrange

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }),
                release: jest.fn()
            }
        });

        //act
        let result =  await sut.getAll();

        //assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);
    });
    let mockUser = new User(1, 'test', 'password', 'Test', 'Testerson', 'email@email.com', 'employee');
    let mockNewUser = new NewUser('test', 'password', 'Test', 'Testerson', 'email@email.com', 3);

    test('should give array of Users when getAll() fetches from data source', async () => {
        expect.hasAssertions();
        //arrange

        jest.fn().mockReturnValue(mockUser);
        
        //act

        let result = await sut.getAll();

        //assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);
        expect(result[0] instanceof Object).toBe(true);


    });

    test('should give user object when getById() fetches from data source', async () => {
        expect.hasAssertions();
        //arrange

        jest.fn().mockReturnValue(mockUser);

        //act

        let result = await sut.getById(mockUser.ers_user_id);
    
        //assert

        expect(result).toBeTruthy();
        expect(mockConnect).toBeCalledTimes(1);
        expect(result instanceof Object).toBe(true);

    });

    test('should give user object when getUserByCreds() fetches from data source', async () => {
        expect.hasAssertions();
        //arrange

        jest.fn().mockReturnValue(mockUser);

        //act

        let result = await sut.getUserByCreds(mockUser.username, mockUser.password);
    
        //assert

        expect(result).toBeTruthy();
        expect(mockConnect).toBeCalledTimes(1);
        expect(result instanceof Object).toBe(true);

    });

    test('should give length 1 of array when when getUserByUniqueKey() fetches existing user from data source', async () => {
        expect.hasAssertions();
        //arrange

        jest.fn().mockReturnValue(mockUser);

        //act

        let result = await sut.getUserByUniqueKey('email', mockUser.email);
    
        //assert

        expect(result).toBeTruthy();
        expect(mockConnect).toBeCalledTimes(1);
        expect(result).toBe(1);

    });

    

    test('should return new user with a valid id when save() adds a new user to the data source', async () => {
        expect.hasAssertions();
        //arrange
        
        //act

        let result = await sut.save(mockNewUser)
        
        //assert

        expect(result).toBeTruthy();
        expect(result.ers_user_id).toBeTruthy();
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should return true when delete method is called', async () => {
        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {return}),
                release: jest.fn()
            }
        });

        let result = await sut.deleteById(1);

        expect(result).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);   
    });

    test('should return updated user object when updateById() is called', async () => {
        expect.hasAssertions();

        jest.fn().mockReturnValue(mockUser);

        let result = await sut.updateById(mockUser);

        expect(result).toBeTruthy();
        expect(mockConnect).toBeCalledTimes(1);
        expect(result instanceof Object).toBe(true);
    });

    // test('should throw 500 error when getAll() query does not return correctly', async() => {
    //     expect.hasAssertions();

    //     (mockConnect as jest.Mock).mockImplementation(() => {
    //         return {
    //             query: jest.fn().mockImplementation(() => {return}),
    //             release: jest.fn()
    //         }
    //     });

    //     try{
    //         await sut.getAll();
    //     } catch (e) {
    //         expect(e instanceof InternalServerError).toBe(true);
    //     }
    // });

    test('should throw 500 error when getByName() query does not return correctly', async() => {
        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return false}),
                release: jest.fn()
            }
        });

        try{
            await sut.getById(1);
        } catch (e) {
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw 500 error when getUserByCreds() query does not return correctly', async() => {
        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return false}),
                release: jest.fn()
            }
        });

        try{
            await sut.getUserByCreds('username', 'password');
        } catch (e) {
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw 500 error when getByUniqueKeys() query does not return correctly', async() => {
        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return false}),
                release: jest.fn()
            }
        });

        try{
            await sut.getUserByUniqueKey('dob', '1-2-90');
        } catch (e) {
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw 500 error when save() query does not return correctly', async() => {
        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return false}),
                release: jest.fn()
            }
        });
        let badUser = new NewUser(null, 'password', 'Test', 'Testerson', 'test@email.com', 3);
        try{
            await sut.save(badUser);
        } catch (e) {
            expect(e instanceof InternalServerError).toBe(true);
        }
    });
});