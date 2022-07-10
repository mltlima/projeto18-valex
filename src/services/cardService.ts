import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';

import * as cardRepository from '../repositories/cardRepository.js';
import { isValid } from '../utils/validate.js';

const transactionTypes = ["groceries", "restaurant", "transport", "education", "health",];
const cryptr = new Cryptr(process.env.SECRET_KEY!);

interface Employee {
    id: number;
    fullName: string;
    cpf: string;
    email: string;
    companyId: number
}

interface Company {
    id: number;
    name: string;
    apiKey: string;
}

export async function createCard(employee: Employee, cardType: cardRepository.TransactionTypes) {
    const { id, fullName } = employee;
    
    if(!transactionTypes.includes(cardType)) {
        throw new Error('Invalid card type');
    }

    const checkCard = await cardRepository.findByTypeAndEmployeeId(cardType, id);
    if(checkCard) {
        throw new Error('Card already exists');
    }

    //get card info
    const cardSecurityCode = faker.finance.creditCardCVV();
    const encryptedCVC = cryptr.encrypt(cardSecurityCode);
    const issuer = faker.finance.creditCardIssuer();
    const cardNumber = faker.finance.creditCardNumber(issuer);
    const expirationDate = dayjs().add(5, "years").format("MM/YY");

    const cardholderName = generateCardName(fullName);

    const cardData = {
        employeeId: id, 
        number: cardNumber,
        cardholderName,
        securityCode: encryptedCVC,
        expirationDate,
        isVirtual: false,
        isBlocked: true,
        type: cardType
    }

    await cardRepository.insert(cardData);
}

function generateCardName(name: string) {
    const nameArray = name.toUpperCase().split(' ');
    const firstName = nameArray[0];
    const lastName = nameArray[nameArray.length - 1];
    let initials = "";
    
    for (let i = 1; i < nameArray.length -1; i++) {
        initials += nameArray[i][0];
    }

    return `${firstName} ${initials} ${lastName}`;
}
