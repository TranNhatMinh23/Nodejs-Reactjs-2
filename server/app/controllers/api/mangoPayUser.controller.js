const MangopayService = require("../../../third-parties/mangopay/MangopaySevice");
const { userService } = require("../../services");

const mongoose = require("mongoose");
const MangoPayUser = mongoose.model("MangopayUser");

const moment = require("moment");

const { mangopayLogger, systemLogger } = require('../../utils/log');
//
// User
//
const getMangoPayUser = (req, res) => {
    MangoPayUser.findOne({ user_id: req.params.user_id })
        .then(async doc => {
            if (doc == null) {
                // createMangoPayUser
                let userData = await userService.getUser(req.params.user_id);
                try {
                    let mangoUser = await MangopayService().createUser({
                        FirstName: userData.first_name,
                        LastName: userData.last_name,
                        Birthday: Number(moment(userData.birthday).format("X")),
                        Email: userData.email,
                        Nationality: "GB",
                        CountryOfResidence: "GB",
                    });
                    mangopayLogger.info(`[CREATE ACCOUNT] - ${userData.email}, successful, ${res.userDevice}`);
                    await MangopayService().createWallet({
                        Owners: [mangoUser.Id],
                        Description: "My Wallet",
                        Currency: "USD",
                    });
                    mangopayLogger.info(`[CREATE WALLET] - ${userData.email}, successful, ${res.userDevice}`);
                    let mangopayUser = new MangoPayUser({
                        user_id: req.params.user_id,
                        mangopay_id: mangoUser.Id
                    });
                    await mangopayUser.save();
                    systemLogger.info(`[MANGOPAY ACCOUNT] - ${userData.email}, successful, ${res.userDevice}`);
                    res.sendData(mangopayUser);
                } catch (err) {
                    systemLogger.error(`[MANGOPAY ACCOUNT] - ${userData.email}, ${err.message}, ${res.userDevice}`);
                    res.sendError(err.message);
                }
            } else {
                res.sendData(doc);
            }
        })
        .catch(err => {
            systemLogger.error(`[MANGOPAY ACCOUNT] - ${userData.email}, can not fetch Mangopay user ${err.message}, ${res.userDevice}`);
            res.sendError(err.message);
        })
}

//
// Wallet
//
const getUserBalance = async (req, res) => {
    try {
        const wallets = await MangopayService().listUserWallets(req.params.mangopay_id);
        const walletDetail = await MangopayService().viewWallet(wallets[0].Id);
        res.sendData(walletDetail.Balance.Amount)
    } catch (err) {
        res.sendError(err.message);
    }
}

const getUserIncome = async (req, res) => {
    try {
        let parameters = req.query.filter && JSON.parse(req.query.filter) || { Type: 'TRANSFER' };
        // make sure the TYPE is "TRANSFER"
        parameters['Type'] = 'TRANSFER';
        const wallets = await MangopayService().listUserWallets(req.params.mangopay_id);
        const income = await MangopayService().listWalletTransactions(wallets[0].Id, parameters);
        res.sendData(income.filter(item => item.CreditedWalletId === wallets[0].Id).map(item => {
            return {
                ...item,
                GigId: item.Tag && item.Tag.substr(0, item.Tag.indexOf(','))
            }
        }))
    } catch (err) {
        res.sendError(err.message);
    }
}

//
// Card
//

const createCardRegistration = async (req, res) => {
    try {
        let data = await MangopayService().createCardRegistration({
            UserId: req.params.mangopay_id
        });
        mangopayLogger.info(`[ADD CARD] - MangopayUser Id ${req.params.mangopay_id}, create card registration, ${res.userDevice}`);
        res.sendData(data);
    } catch (err) {
        mangopayLogger.error(`[ADD CARD] - MangopayUser Id ${req.params.mangopay_id}, create card registration, ${err.message}, ${res.userDevice}`);
        res.sendError(err.message);
    }
}

const updateCardRegistration = async (req, res) => {
    try {
        let data = await MangopayService().updateCardRegistration({
            Id: req.body.Id,
            RegistrationData: req.body.RegistrationData
        });
        mangopayLogger.info(`[ADD CARD] - CardRegistration Id ${req.body.Id}, update card registration, ${res.userDevice}`);
        res.sendData(data);
    } catch (err) {
        mangopayLogger.error(`[ADD CARD] - CardRegistration Id ${req.body.Id}, update card registration, ${err.message}, ${res.userDevice}`);
        res.sendError(err.message);
    }
}

const listUserCards = (req, res) => {
    MangopayService().listUserCards(req.params.mangopay_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            mangopayLogger.error(`[FETCH USER CARDS] - MangopayUser Id ${req.params.mangopay_id}, ${err.message}, ${res.userDevice}`);
            res.sendError(err.message);
        })
}

const viewCard = (req, res) => {
    MangopayService().viewCard(req.params.card_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            mangopayLogger.error(`[FETCH CARD DETAIL] - Card Id ${req.params.mangopay_id}, ${err.message}, ${res.userDevice}`);
            res.sendError(err.message);
        })
}

const deactivateCard = (req, res) => {
    MangopayService().deactivateCard(req.params.card_id)
        .then(data => {
            mangopayLogger.info(`[DEACTIVATE CARD] - Card Id ${req.params.card_id}, successful, ${res.userDevice}`);
            res.sendData(data);
        })
        .catch(err => {
            mangopayLogger.error(`[DEACTIVATE CARD] - Card Id ${req.params.card_id}, ${err.message}, ${res.userDevice}`);
            res.sendError(err.message);
        })
}

// Payin

const directPayIn = async (req, res) => {
    let AuthorId = req.body.AuthorId;
    let userWallets = await MangopayService().listUserWallets(AuthorId);
    try {
        let data = await MangopayService().directPayIn({
            AuthorId: AuthorId,
            CreditedWalletId: userWallets[0].Id,
            DebitedFunds: {
                Amount: req.body.Amount
            },
            CardId: req.body.CardId,
        })
        mangopayLogger.info("Successfully create direct payin for Mangopay Id " + AuthorId + ", from Card Id " + req.body.CardId + " to Wallet Id " + userWallets[0].Id + ", amount of $" + req.body.Amount + ", " + res.userDevice);
        res.sendData(data)
    } catch (err) {
        mangopayLogger.error("Error when creating direct payin for Mangopay Id " + AuthorId + ", from Card Id " + req.body.CardId + " to Wallet Id " + userWallets[0].Id + ", amount of $" + req.body.Amount + ", " + err.message + ", " + res.userDevice);
        res.sendError(err.message);
    }
}

const webPayin = async (req, res) => {
    let AuthorId = req.body.mangopay_id;
    let userWallets = await MangopayService().listUserWallets(AuthorId);
    try {
        let data = await MangopayService().webPayIn(
            {
                AuthorId: req.body.mangopay_id,
                ReturnURL: req.body.ReturnURL,
                CreditedWalletId: userWallets[0].Id,
                DebitedFunds: {
                    Amount: req.body.Amount
                }
            }
        )
        mangopayLogger.info("Successfully create web payin for Mangopay Id " + AuthorId + " to Wallet Id " + userWallets[0].Id + ", amount of $" + req.body.Amount + ", " + res.userDevice);
        res.sendData(data)
    } catch (err) {
        mangopayLogger.error("Error when creating web payin for Mangopay Id " + AuthorId + " to Wallet Id " + userWallets[0].Id + ", amount of $" + req.body.Amount + ", " + err.message + ", " + res.userDevice);
        res.sendError(err.message);
    }
}

const cardPreAuthPayIn = (req, res) => {
    MangopayService().cardPreAuthPayIn({
        AuthorId: req.params.mangopay_id,
        CreditedWalletId: req.body.CreditedWalletId,
        DebitedFunds: {
            Currency: "USD",
            Amount: req.body.Amount * 100,
        },
        Fees: {
            // The debitedFunds's currency and the fees's currency must be the same
            Currency: "USD",
            Amount: 0
        },
        PaymentType: "PREAUTHORIZED",
        ExecutionType: "DIRECT",
        PreauthorizationId: req.body.PreauthorizationId,
    })
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

// Payout
const createPayout = async (req, res) => {
    try {
        let wallets = await MangopayService().listUserWallets(req.params.mangopay_id);
        let banks = await MangopayService().getUserBankAccounts({ UserId: req.params.mangopay_id });
        let payout = await MangopayService().createPayout({
            AuthorId: req.params.mangopay_id,
            DebitedFunds: {
                Amount: req.body.amount * 100
            },
            BankAccountId: banks[0].Id,
            DebitedWalletId: wallets[0].Id,
            BankWireRef: "Talent payout",
        })
        if (payout.Status === 'CREATED') {
            res.sendData("Success")
        } else if (payout.Status === 'FAILED') {
            res.sendError(payout.ResultMessage)
        }
    } catch (error) {
        console.log({ error })
        res.sendError("Error")
    }

}


// Transfer

const createTransfer = async (req, res) => {
    try {
        let AuthorWallets = await MangopayService().listUserWallets(req.body.AuthorId);
        let ReceiverWallets = await MangopayService().listUserWallets(req.body.ReceiverId);
        let data = await MangopayService().createTransfer({
            AuthorId: req.body.AuthorId,
            DebitedFunds: {
                // The Wallet's currency and the DebitedFunds's currency must be the same
                // unit: cent
                Amount: req.body.Amount * 100
            },
            //The Debited Wallet's currency and the Credited Wallet's currency must be the same
            // from
            DebitedWalletId: AuthorWallets[0].Id,
            // to
            CreditedWalletId: ReceiverWallets[0].Id,
        })
        mangopayLogger.info("Successfully create transfer from Mangopay Id " + req.body.AuthorId + " (Wallet Id  " + AuthorWallets[0].Id + " ) to Mangopay Id " + req.body.ReceiverId + "( Wallet Id " + ReceiverWallets[0].Id + " ), amount of $" + req.body.Amount + ", " + res.userDevice);
        res.sendData(data);
    } catch (err) {
        mangopayLogger.error("Successfully create transfer from Mangopay Id " + req.body.AuthorId + " (Wallet Id  " + AuthorWallets[0].Id + " ) to Mangopay Id " + req.body.ReceiverId + "( Wallet Id " + ReceiverWallets[0].Id + " ), amount of $" + req.body.Amount + ", " + err.message + ", " + res.userDevice);
        res.sendError(err.message);
    }
}


// Bank
const createBankAccountGB = (req, res) => {
    MangopayService().createBankAccountGB({
        UserId: req.body.mangopay_id,
        OwnerAddress: {
            AddressLine1: req.body.AddressLine1,
            AddressLine2: req.body.AddressLine2 || "",
            City: req.body.City,
            PostalCode: req.body.PostalCode,
            Country: req.body.Country || "GB",
        },
        OwnerName: req.body.OwnerName,
        SortCode: req.body.SortCode,
        AccountNumber: req.body.AccountNumber,
    })
        .then(data => {
            mangopayLogger.info("Successfully add bank account for Mangopay Id " + req.body.mangopay_id + ", " + res.userDevice);
            res.sendData(data);
        })
        .catch(err => {
            console.log("zxc", err.message)
            mangopayLogger.error("Error when adding bank account for Mangopay Id " + req.body.mangopay_id + ", " + err.message + ", " + res.userDevice);
            res.sendError(err.message);
        })
}

const getUserBankAccounts = (req, res) => {
    MangopayService().getUserBankAccounts({
        UserId: req.params.mangopay_id
    })
        .then(data => {
            // mangopayLogger.info("Successfully get banks list for Mangopay Id " + req.params.mangopay_id + ", " + res.userDevice);
            res.sendData(data);
        })
        .catch(err => {
            mangopayLogger.error("Error when getting banks list for Mangopay Id " + req.params.mangopay_id + ", " + err.message + ", " + res.userDevice);
            res.sendError(err.message);
        })
}

const getBankAccountDetail = (req, res) => {
    MangopayService().getBankAccountDetail({
        UserId: req.params.mangopay_id,
        BankAccountId: req.params.BankAccountId
    })
        .then(data => {
            // mangopayLogger.info("Successfully get bank detail for Mangopay Id " + req.params.mangopay_id + ", " + res.userDevice);
            res.sendData(data);
        })
        .catch(err => {
            mangopayLogger.error("Error when getting bank detail for Mangopay Id " + req.params.mangopay_id + ", " + err.message + ", " + res.userDevice);
            res.sendError(err.message);
        })
}

const deactivateBankAccount = (req, res) => {
    MangopayService().deactivateBankAccount({
        UserId: req.params.mangopay_id,
        BankAccountId: req.params.BankAccountId
    })
        .then(data => {
            mangopayLogger.info("Successfully deactivate bank for Mangopay Id " + req.params.mangopay_id + ", BankAccount Id " + req.params.BankAccountId + ", " + res.userDevice);
            res.sendData(data);
        })
        .catch(err => {
            mangopayLogger.error("Error when deactivating bank for Mangopay Id " + req.params.mangopay_id + ", BankAccount Id " + req.params.BankAccountId + ", " + err.message + ", " + res.userDevice);
            res.sendError(err.message);
        })
}

//
// TRANSACTION
//
// Get Parameters :
// req.query.filter = {
//     Page: 1,
//     Per_Page: 25,
//     Sort: "CreationDate:DESC",
//     // timestamp format
//     BeforeDate: 1463440221,
//     AfterDate: 1431817821,
//     Status: "CREATED,FAILED",
//     Nature: "REGULAR,REFUND",
//     Type: "PAYIN,PAYOUT",
//     ResultCode: "000000,009199"
// }
const listUserTransactions = (req, res) => {
    let UserID = req.params.mangopay_id;
    let parameters = req.query.filter && JSON.parse(req.query.filter);
    MangopayService().listUserTransactions(UserID, parameters)
        .then(data => {
            res.sendData(data.map(item => {
                return {
                    ...item,
                    GigId: item.Tag && item.Tag.substr(0, item.Tag.indexOf(','))
                }
            }))
        })
        .catch(err => {
            res.sendError(err.message)
        })
}

const getTransactionDetail = (req, res) => {
    const UserId = req.params.mangopay_id;
    const TransactionId = req.params.transactionId;
    MangopayService().getTransactionDetail(UserId, TransactionId)
        .then(data => {
            res.sendData(data)
        })
        .catch(err => {
            res.sendError(err.message)
        })
}

// CardPreAuthorization
const createCardPreAuth = (req, res) => {
    MangopayService().createCardPreAuth({
        AuthorId: req.params.mangopay_id,
        DebitedFunds: {
            // The Wallet's currency and the DebitedFunds's currency must be the same
            Currency: "USD",
            // unit: cent
            Amount: req.body.Amount * 100
        },
        // The StatementDescriptor must not be longer than 10 characters.
        // StatementDescriptor: req.body.StatementDescriptor,
        // Billing: {
        //     Address: {
        //         AddressLine1: req.body.AddressLine1,
        //         AddressLine2: req.body.AddressLine2 || "",
        //         City: req.body.City,
        //         Region: req.body.Region,
        //         PostalCode: req.body.PostalCode,
        //         Country: req.body.Country || "GB",
        //     }
        // },
        CardId: req.body.CardId,
        SecureModeReturnURL: req.headers.origin + "/payment-process"
    })
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message)
        })
}

const getCardPreAuthDetail = (req, res) => {
    MangopayService().getCardPreAuth(req.params.preAuthId)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message)
        })
}

const getKycDocuments = async (req, res) => {
    try {
        let data = false;
        const kycs = await MangopayService().getKycDocuments(req.params.mangopay_id);
        for (let i = 0; i < kycs.length; i++) {
            if (kycs[i].Type === 'IDENTITY_PROOF' && kycs[i].Status === 'VALIDATED') {
                data = true;
                break
            }
        }
        res.sendData(data)
    } catch (err) {
        res.sendError(err.message);
    }
}

module.exports = {
    getMangoPayUser,
    // Wallet
    getUserBalance,
    getUserIncome,
    // Card
    createCardRegistration,
    updateCardRegistration,
    listUserCards,
    viewCard,
    deactivateCard,
    // Payin
    directPayIn,
    webPayin,
    cardPreAuthPayIn,
    // Payout
    createPayout,
    // Transfer
    createTransfer,
    // Bank
    createBankAccountGB,
    getUserBankAccounts,
    getBankAccountDetail,
    deactivateBankAccount,
    // Transactions
    listUserTransactions,
    getTransactionDetail,
    // cardPreAuthorization
    createCardPreAuth,
    getCardPreAuthDetail,
    getKycDocuments
}