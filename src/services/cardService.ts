import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';

import * as cardRepository from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as rechageRepository from '../repositories/rechargeRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';
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

export async function activateCard(cardId: number, password: string, securityCode: number) {
    const card = await cardRepository.findById(cardId);
    isValid(card, 'Card not found');

    if(card.password) {
        throw new Error('Card already activated');
    }

    if (dayjs(card.expirationDate).diff() > 0) {
        throw new Error('Card expired');
    }

    const decryptedCVC = cryptr.decrypt(card.securityCode);
    if(Number(decryptedCVC) !== securityCode) {
        throw new Error('Invalid security code');
    }

    const encryptedPassword = cryptr.encrypt(password);
    await cardRepository.update(cardId, { password: encryptedPassword });

    await cardRepository.update(cardId, { isBlocked: false });
}

export async function getCard(cardId: number, password: string) {
    const card = await cardRepository.findById(cardId);
    isValid(card, 'Card not found');

    const decryptedPassword = cryptr.decrypt(card.password);
    isValid(decryptedPassword, 'card is not active');
    
    if(decryptedPassword !== password.toString()) {
        throw new Error('Invalid password');
    }

    return card;
}

export async function getCardBalance(cardId: number) {
    let transactionTotal = 0;
    let rechargeTotal = 0;

    const transactions = await getCardTransactions(cardId);
    const recharges = await getCardRecharges(cardId);

    transactions.map((transaction) => (transactionTotal += transaction.amount));
    recharges.map((recharge) => (rechargeTotal += recharge.amount));
    return {
        "balance": rechargeTotal - transactionTotal,
        "transactions": transactions,
        'recharges': recharges
    }
}

export async function blockCard(cardId: number, password: string) {
    const card = await checkCard(cardId, password);
    
    if(card.isBlocked) {
        throw new Error('Card already blocked');
    }

    await cardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
    const card = await checkCard(cardId, password);

    if(!card.isBlocked) {
        throw new Error('Card already unblocked');
    }

    await cardRepository.update(cardId, { isBlocked: false });
}

export async function rechargeCard(cardId: number, amount: number) {
    const card = await cardRepository.findById(cardId);
    isValid(card, 'Card not found');
    isValid(card.password, 'Card not activated');


    if(card.isBlocked) {
        throw new Error('Card is blocked');
    }

    if(dayjs(card.expirationDate).diff() > 0) { 
        throw new Error('Card expired');
    }

    const rechargeData = {
        cardId,
        amount
    }

    await rechageRepository.insert(rechargeData);
}

async function getCardTransactions(cardId: number) {
    const transactions = await paymentRepository.findByCardId(cardId);

    return transactions;
}

async function getCardRecharges(cardId: number) {
    const recharges = await rechageRepository.findByCardId(cardId);

    return recharges;
}

export async function payment(cardId: number, amount: number, businessId: number, password: string) {
    const business = await businessRepository.findById(businessId);
    isValid(business, 'Business not found');

    const card = await cardRepository.findById(cardId);
    isValid(card, 'Card not found');

    if(card.type !== business.type) {
        throw new Error('Invalid card type');
    }

    checkCard(cardId, password);
    
    const balance = await getCardBalance(cardId);

    if (balance.balance < amount) {
        throw new Error('Insufficient funds');
    }
    
    const paymentData = {
        cardId,
        amount,
        businessId
    }
    await paymentRepository.insert(paymentData);

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


async function checkCard(cardId: number, password: string) {
    const card = await cardRepository.findById(cardId);
    isValid(card, 'Card not found');
    
    const decryptedPassword = cryptr.decrypt(card.password);
    if(decryptedPassword !== password.toString()) {
        throw new Error('Invalid password');
    }
    
    if(dayjs(card.expirationDate).diff() > 0) { 
        throw new Error('Card expired');
    }

    return card;
}