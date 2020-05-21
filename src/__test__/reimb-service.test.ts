import { ReimbService } from '../services/reimb-service';
import { ReimbRepo } from '../repos/reimb-repo';
import { Reimbursement } from '../models/reimb';
import { NewReimbursement } from '../models/newReimb';
import Validation from '../util/validation';
import { DataPersistanceError, BadRequestError, ResourceNotFoundError} from '../error/error';

jest.mock('../repos/user-repo', () => {
    return new class UserRepo {
        getAll = jest.fn();
        getById = jest.fn();
        save = jest.fn();
        getReimbByUserId = jest.fn();
        updateById = jest.fn();
    }
});

describe('reimbService', () => {
    let sut: ReimbService;
    let mockRepo;

    let mockReimbs = [
        new Reimbursement(1, 10.00, Date.now(), Date.now(), 'test 1', 1, 2, 'approved', 'other'),
        new Reimbursement(2, 10.00, Date.now(), Date.now(), 'test 2', 1, 2, 'approved', 'other'),
        new Reimbursement(3, 10.00, Date.now(), Date.now(), 'test 3', 1, 2, 'approved', 'other'),
        new Reimbursement(4, 10.00, Date.now(), Date.now(), 'test 4', 1, 2, 'approved', 'other'),
        new Reimbursement(5, 10.00, Date.now(), Date.now(), 'test 5', 1, 2, 'approved', 'other'),
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {

            return{
                getAll: jest.fn(),
                getById: jest.fn(),
                save: jest.fn(),
                getReimbByUserId: jest.fn(),
                updateById: jest.fn()
            }
        });
        
        sut = new ReimbService(mockRepo);
    });

    test('should resolve to Reimb[] when getAllReimbs() succesfully retrieves from the data source', async () => {

        //arrange
        expect.hasAssertions()
        mockRepo.getAll = jest.fn().mockReturnValue(mockReimbs)
        //act

        let result = await sut.getAllReimbs();

        //assert\
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
    });

    test('should reject with ResourceNotfoundError when getallReimbs fails to get any user from the data dource', async() => {
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        try {
            await sut.getAllReimbs();
        } catch (e) {
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should resolve to User when getReimbById is given a valid a known id', async() => {
        expect.hasAssertions();

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Reimbursement>((resolve) => resolve(mockReimbs[0]));
        });

        Validation.isEmptyObject = jest.fn().mockReturnValue(false);

        let result = await sut.getReimbById(1);

        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(1);
        expect(result.description).toBe('test 1');
    });

    // test('should result in BadRequestError when getReimbById is given an id that is not a number', async() => {
    //     expect.hasAssertions();
    //     Validation.isValidNumber = jest.fn().mockReturnValue(false);
        
    //     try {
    //         //@ts-ignore
    //         await sut.getUserById('');
    //     } catch (e) {
    //         expect(e instanceof BadRequestError).toBe(true);
    //     }
    // });

    // test('should reject with ResourceNotfoundError when getReimbById fails to get a Reimb from the data dource', async() => {
    //     expect.hasAssertions();
    //     mockRepo.getAll = jest.fn().mockReturnValue([]);

    //     try {
    //         await sut.getReimbById(6);
    //     } catch (e) {
    //         expect(e instanceof ResourceNotFoundError).toBe(true);
    //     }
    // });


    test('should return new object when a valid Newreimb object is added to addNewReimb', async() => {

        expect.hasAssertions();
        Validation.isValidObject=jest.fn().mockReturnValue(true);


        mockRepo.save = jest.fn().mockImplementation((newReimb: NewReimbursement) => {
            return new Promise<Reimbursement>((resolve) => resolve(mockReimbs[2]));
        });

        let result = await sut.addNewReimb(new NewReimbursement(10.00, Date.now(), 'test', 1, 1, 2))

        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(3);
        expect(result instanceof Object).toBe(true);

    });
    
    test('should return Bad Request error if given an object with null values', async() => {

        expect.hasAssertions();
        Validation.isValidObject=jest.fn().mockReturnValue(false);

        try {
            await sut.addNewReimb(new NewReimbursement(null, Date.now(), 'test', 1, 1, 2))
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    // test('should return DataSaveError if given a conflict', async() => {

    //     expect.hasAssertions();
    //     Validation.isValidObject=jest.fn().mockReturnValue(true);
    //     mockRepo.getUserByUniqueKey = jest.fn().mockReturnValueOnce(1);
        
    //     try{
    //         await sut.addNewReimb(new NewReimbursement(1, Date.now(), 'test', 1, 1, 2))
    //     } catch (e) {
    //         expect(e instanceof DataPersistanceError).toBe(true);
    //     }
    // });


    test('should return true when updateReimb is given valid Reimb', async() => {
        expect.hasAssertions();
        Validation.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.updateById = jest.fn().mockReturnValue(mockReimbs[4]);

        let result = await sut.updateReimb(mockReimbs[4]);

        expect(result).toBe(true);     
    });

    test('should return BadRequestError when updateReimb is given invalid object', async() => {
        expect.hasAssertions();
        Validation.isValidObject=jest.fn().mockReturnValue(false);

        try{
            await sut.updateReimb(new Reimbursement(5, null, Date.now(), Date.now(), 'test 5', 1, 2, 'approved', 'other'));
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }  
    });

    test('should resolve to Reimb[] when getReimbByUserId() succesfully retrieves from the data source', async () => {

        //arrange
        expect.hasAssertions()
        Validation.isValidNumber = jest.fn().mockReturnValue(false)
        mockRepo.getReimbByUserId = jest.fn().mockReturnValue(mockReimbs)
        //act

        let result = await sut.getReimbByUserId(1);

        //assert\
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
    });

});