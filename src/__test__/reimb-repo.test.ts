import { ReimbRepo } from '../repos/reimb-repo';
import * as mockIndex from '..';
import { Reimbursement } from '../models/reimb';
import { NewReimbursement } from '../models/newReimb'
import { InternalServerError } from '../error/error';

jest.mock('..', ()=> {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

describe('reimbRepo', () => {

    let sut = new ReimbRepo();
    let mockConnect = mockIndex.connectionPool.connect;

    
    beforeEach(() => {
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                "reimb_id": 1,
                                "amount": 10.00,
                                "submitted": Date.now(),
                                "resolved": Date.now(),
                                "description": 'test',
                                "author_id": 1,
                                "resolver_id": 2,
                                "reimb_status": 'pending',
                                "reimb_type": 'other'
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
    let mockReimb = new Reimbursement(1, 10.00, Date.now(), Date.now(), 'test', 1, 2, 'pending', 'other');
    let mockNewReimb = new NewReimbursement(10.00, Date.now(), 'test', 1, 1, 4);

    test('should give array of Reimbs when getAll() fetches from data source', async () => {
        expect.hasAssertions();
        //arrange

        jest.fn().mockReturnValue(mockReimb);
        
        //act

        let result = await sut.getAll();

        //assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);
        expect(result[0] instanceof Object).toBe(true);


    });

    test('should give array of Reimbs when getreimbByUserId() fetches from data source', async () => {
        expect.hasAssertions();
        //arrange

        jest.fn().mockReturnValue(mockReimb);
        
        //act

        let result = await sut.getReimbByUserId(1);

        //assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);
        expect(result[0] instanceof Object).toBe(true);


    });

    test('should give reimb object when getById() fetches from data source', async () => {
        expect.hasAssertions();
        //arrange

        jest.fn().mockReturnValue(mockReimb);

        //act

        let result = await sut.getById(mockReimb.reimb_id);
    
        //assert

        expect(result).toBeTruthy();
        expect(mockConnect).toBeCalledTimes(1);
        expect(result instanceof Object).toBe(true);

    });



    

    test('should return new reimb with a valid id when save() adds a new user to the data source', async () => {
        expect.hasAssertions();
        //arrange
        
        //act

        let result = await sut.save(mockNewReimb)
        
        //assert

        expect(result).toBeTruthy();
        expect(result.reimb_id).toBeTruthy();
        expect(mockConnect).toBeCalledTimes(1);
    });


    test('should return updated user object when updateById() is called', async () => {
        expect.hasAssertions();

        jest.fn().mockReturnValue(mockReimb);

        let result = await sut.updateById(mockReimb);

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



    test('should throw 500 error when save() query does not return correctly', async() => {
        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return false}),
                release: jest.fn()
            }
        });
        let badUser = new NewReimbursement(null, Date.now(), 'test', 1, 1, 4);
        try{
            await sut.save(badUser);
        } catch (e) {
            expect(e instanceof InternalServerError).toBe(true);
        }
    });
});