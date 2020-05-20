import { UserService } from '../services/user-service';
import { UserRepo } from '../repos/user-repo';
import { User } from '../models/user';
import { NewUser } from '../models/newUser';
import Validation from '../util/validation';
import { DataPersistanceError, BadRequestError, ResourceNotFoundError} from '../error/error';

jest.mock('../repos/user-repo', () => {
    return new class UserRepo {
        getAll = jest.fn();
        getById = jest.fn();
        save = jest.fn();
        deleteById = jest.fn();
        getUserByCreds = jest.fn();
        gteUserByUniqueKey = jest.fn();
        updateById = jest.fn();
    }
});

describe('userService', () => {
    let sut: UserService;
    let mockRepo;

    let mockUsers = [
        new User(1, 'one', 'password', 'One', 'Testerson', 'email1@email.com', 'employee'),
        new User(2, 'two', 'password', 'Two', 'Testerson', 'email2@email.com', 'employee'),
        new User(3, 'three', 'password', 'Three', 'Testerson', 'email3@email.com', 'employee'),
        new User(4, 'four', 'password', 'Four', 'Testerson', 'email4@email.com', 'employee'),
        new User(5, 'five', 'password', 'Five', 'Testerson', 'email5@email.com', 'employee')
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {

            return{
                getAll: jest.fn(),
                getById: jest.fn(),
                save: jest.fn(),
                deleteById: jest.fn(),
                getUserByCreds: jest.fn(),
                gteUserByUniqueKey: jest.fn(),
                updateById: jest.fn()
            }
        });
        
        sut = new UserService(mockRepo);
    });

    test('should resolve to User[] when getAllUsers() succesfully retrieves users from the data source', async () => {

        //arrange
        expect.hasAssertions()
        mockRepo.getAll = jest.fn().mockReturnValue(mockUsers)
        //act

        let result = await sut.getAllUsers();

        //assert\
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
    });

    test('should reject with ResourceNotfoundError when getallUsers fails to get any user from the data dource', async() => {
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        try {
            await sut.getAllUsers();
        } catch (e) {
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should resolve to User when getUserById is given a valid a known id', async() => {
        expect.hasAssertions();
        Validation.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[0]));
        });

        Validation.isEmptyObject = jest.fn().mockReturnValue(false);

        let result = await sut.getUserById(1);

        expect(result).toBeTruthy();
        expect(result.ers_user_id).toBe(1);
        expect(result.username).toBe('one');
    });

    test('should result in BadRequestError when getUserById is given an id that is not a number', async() => {
        expect.hasAssertions();
        
        try {
            //@ts-ignore
            await sut.getUserById('gone');
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject with ResourceNotfoundError when getUserById fails to get a user from the data dource', async() => {
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        try {
            await sut.getUserById(6);
        } catch (e) {
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });


    test('should return new object when a valid NewUser object is added to addNewUser', async() => {

        expect.hasAssertions();
        Validation.isValidObject=jest.fn().mockReturnValue(true);

        mockRepo.getUserByUniqueKey = jest.fn().mockReturnValue(0);

        mockRepo.save = jest.fn().mockImplementation((newUser: NewUser) => {
            return new Promise<User>((resolve) => resolve(mockUsers[2]));
        });

        let result = await sut.addNewUser(new NewUser('three', 'password', 'Three', 'Testerson', 'email3@email.com', 3))

        expect(result).toBeTruthy();
        expect(result.ers_user_id).toBe(3);
        expect(result instanceof Object).toBe(true);

    });
    
    test('should return Bad Request error if given an object with null values', async() => {

        expect.hasAssertions();
        Validation.isValidObject=jest.fn().mockReturnValue(false);

        try {
            await sut.addNewUser(new NewUser(null, 'password', 'Three', 'Testerson', 'email3@email.com', 3))
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should return DataSaveError if given a conflict', async() => {

        expect.hasAssertions();
        Validation.isValidObject=jest.fn().mockReturnValue(true);
        mockRepo.getUserByUniqueKey = jest.fn().mockReturnValueOnce(1);

        
        try{
            await sut.addNewUser(new NewUser(null, 'password', 'Three', 'Testerson', 'email3@email.com', 3))
        } catch (e) {
            expect(e instanceof DataPersistanceError).toBe(true);
        }
    });

    test('should return true when deleteUserbyId is given valid User id', async() => {
        expect.hasAssertions();
        Validation.isValidNumber=jest.fn().mockReturnValue(true);
        mockRepo.deleteById = jest.fn().mockReturnValue(true);

        let result = await sut.deleteUserById(4);

        expect(result).toBe(true);   
    });

    test('should return BadRequestError when deleteUserbyId is given bad number', async() => {
        expect.hasAssertions();
        Validation.isValidNumber=jest.fn().mockReturnValue(false);

        try{
            //@ts-ignore
            await sut.deleteUserById('');
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }  
    });

    test('should return true when updateUser is given valid User', async() => {
        expect.hasAssertions();
        Validation.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.updateById = jest.fn().mockReturnValue(mockUsers[4]);

        let result = await sut.updateUser(mockUsers[4]);

        expect(result).toBe(true);     
    });

    test('should return BadRequestError when updateUser is given invalid object', async() => {
        expect.hasAssertions();
        Validation.isValidObject=jest.fn().mockReturnValue(false);

        try{
            await sut.updateUser(new User(4, null, 'password', 'Three', 'Testerson', 'email3@email.com', '1'));
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }  
    });

    test('should return with BadRequest Error if authUser is given an invalid string for username', async() => {
        expect.hasAssertions();
        Validation.isValidString=jest.fn().mockRejectedValue(false);

        try{
            await sut.authUser('','');
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to User when authUser is given a valid username and password', async() => {
        expect.hasAssertions();
        Validation.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getUserByCreds = jest.fn().mockImplementation((un: string, pw: string) => {
            return new Promise<User>((resolve) => resolve(mockUsers[0]));
        });

        let result = await sut.authUser('one', 'password');

        expect(result).toBeTruthy();
        expect(result.ers_user_id).toBe(1);
        expect(result.username).toBe('one');
    });

});