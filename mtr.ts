import { Context, Contract } from 'fabric-contract-api';
import { Mtr } from './mtr';

export class Mtr extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const mtrs: Mtr[] = [
            {
                mtrStartDate: [],
                mtrEndDate: [],
                mtrTime: 1,
                mtrName: 'aza',
                mtrPart: 'Typescript',
                mtrplace: 'school',
                mtrArea: 'Incheon',
                mtrContents: [],
                mtrType: 1,
                mtrMentoName: 'haebin',
                mtrMenteeName: 'swunee'
            }
        ];
/*  활동시작 - mtrStartDate
    활동마감 - mtrEndDate
    활동시간 - mtrTime
    활동이름 - mtrName
    활동분야 - mtrPart
    활동기관 - mtrplace
    활동지역 - mtrArea
    활동내용 - mtrContents
    활동유형 - mtrType
    어떤멘토가진행했는지 - mtrMento
    어떤멘티가진행했는지 - mtrMentee  */

        for (let i = 0; i < mtrs.length; i++) {
            mtrs[i].docType = 'mtr';
            await ctx.stub.putState('MTR' + i, Buffer.from(JSON.stringify(mtrs[i])));
            console.info('Added <--> ', mtrs[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryMtr(ctx: Context, mtrNumber: string): Promise<string> {
        const mtrAsBytes = await ctx.stub.getState(mtrNumber); // get the car from chaincode state
        if (!mtrAsBytes || mtrAsBytes.length === 0) {
            throw new Error(`${mtrNumber} does not exist`);
        }
        console.log(mtrAsBytes.toString());
        return mtrAsBytes.toString();
    }

    public async createMtr(
        ctx: Context, 
        mentoringNumber: string, 
        mtrStartDate: string, 
        mtrEndDate: string, 
        mtrTime: number, 
        mtrName: string,
        mtrPart: string,
        mtrplace: string,
        mtrArea: string,
        mtrContents: string,
        mtrType: string,
        mtrMentoName: string,
        mtrMenteeName: string
        ) {
        console.info('============= START : Create Mtr ===========');

        const mtr: Mtr = {
            docType: 'mtr',
            mentoringNumber,
            mtrStartDate,
            mtrEndDate,
            mtrTime,
            mtrName,
            mtrPart,
            mtrplace,
            mtrArea,
            mtrContents,
            mtrType,
            mtrMentoName,
            mtrMenteeName
        };

        await ctx.stub.putState(mtrNumber, Buffer.from(JSON.stringify(mtr)));
        console.info('============= END : Create Mtr ===========');
    }

    public async queryAllMtrs(ctx: Context): Promise<string> {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }







    
    //changeCarOwner가 필요한 로직인가..?
    public async changeCarOwner(ctx: Context, carNumber: string, newOwner: string) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car: Car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}