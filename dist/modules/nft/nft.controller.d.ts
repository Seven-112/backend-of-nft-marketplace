export declare class NFTController {
    constructor();
    findAll(query: {
        filter: string;
    }): {
        code: number;
        message: string;
        data: {
            nfts: {
                auction: {
                    pubkey: string;
                    account: {
                        executable: boolean;
                        lamports: number;
                        owner: string;
                        rentEpoch: number;
                        data: {
                            type: string;
                            data: number[];
                        };
                    };
                    info: {
                        authority: string;
                        tokenMint: string;
                        endedAt: string;
                        priceFloor: {
                            type: number;
                            hash: {
                                '0': number;
                                '1': number;
                                '2': number;
                                '3': number;
                                '4': number;
                                '5': number;
                                '6': number;
                                '7': number;
                                '8': number;
                                '9': number;
                                '10': number;
                                '11': number;
                                '12': number;
                                '13': number;
                                '14': number;
                                '15': number;
                                '16': number;
                                '17': number;
                                '18': number;
                                '19': number;
                                '20': number;
                                '21': number;
                                '22': number;
                                '23': number;
                                '24': number;
                                '25': number;
                                '26': number;
                                '27': number;
                                '28': number;
                                '29': number;
                                '30': number;
                                '31': number;
                            };
                            minPrice: string;
                        };
                        state: number;
                        bidState: {
                            type: number;
                            bids: any[];
                            max: string;
                        };
                    };
                };
                auctionManager: {
                    pubkey: string;
                    instance: {
                        pubkey: string;
                        account: {
                            executable: boolean;
                            lamports: number;
                            owner: string;
                            rentEpoch: number;
                            data: {
                                type: string;
                                data: number[];
                            };
                        };
                        info: {
                            key: number;
                            store: string;
                            authority: string;
                            auction: string;
                            vault: string;
                            acceptPayment: string;
                            state: {
                                status: number;
                                safetyConfigItemsValidated: string;
                                bidsPushedToAcceptPayment: string;
                                hasParticipation: number;
                            };
                            auctionDataExtended: string;
                        };
                    };
                    numWinners: string;
                    safetyDepositBoxesExpected: string;
                    store: string;
                    authority: string;
                    vault: string;
                    acceptPayment: string;
                    auction: string;
                    status: number;
                    safetyDepositConfigs: any[];
                    bidRedemptions: any[];
                };
                state: string;
                vault: {
                    pubkey: string;
                    account: {
                        executable: boolean;
                        lamports: number;
                        owner: string;
                        rentEpoch: number;
                        data: {
                            type: string;
                            data: number[];
                        };
                    };
                    info: {
                        key: number;
                        tokenProgram: string;
                        fractionMint: string;
                        authority: string;
                        fractionTreasury: string;
                        redeemTreasury: string;
                        allowFurtherShareCreation: number;
                        pricingLookupAddress: string;
                        tokenTypeCount: number;
                        state: number;
                        lockedPricePerShare: string;
                    };
                };
                safetyDepositBoxes: any[];
                items: any[][];
                thumbnail: {
                    metadata: {
                        pubkey: string;
                        account: {
                            executable: boolean;
                            lamports: number;
                            owner: string;
                            rentEpoch: number;
                            data: {
                                type: string;
                                data: number[];
                            };
                        };
                        info: {
                            key: number;
                            updateAuthority: string;
                            mint: string;
                            data: {
                                name: string;
                                symbol: string;
                                uri: string;
                                sellerFeeBasisPoints: number;
                                creators: {
                                    address: string;
                                    verified: number;
                                    share: number;
                                }[];
                            };
                            primarySaleHappened: number;
                            isMutable: number;
                            editionNonce: number;
                            tokenStandard: number;
                            edition: string;
                            masterEdition: string;
                        };
                    };
                };
                isInstantSale: boolean;
                totallyComplete: boolean;
            }[];
        };
    };
    getMyNFT(): {
        code: number;
        message: string;
        data: {
            nfts: {
                auction: {
                    pubkey: string;
                    account: {
                        executable: boolean;
                        lamports: number;
                        owner: string;
                        rentEpoch: number;
                        data: {
                            type: string;
                            data: number[];
                        };
                    };
                    info: {
                        authority: string;
                        tokenMint: string;
                        endedAt: string;
                        priceFloor: {
                            type: number;
                            hash: {
                                '0': number;
                                '1': number;
                                '2': number;
                                '3': number;
                                '4': number;
                                '5': number;
                                '6': number;
                                '7': number;
                                '8': number;
                                '9': number;
                                '10': number;
                                '11': number;
                                '12': number;
                                '13': number;
                                '14': number;
                                '15': number;
                                '16': number;
                                '17': number;
                                '18': number;
                                '19': number;
                                '20': number;
                                '21': number;
                                '22': number;
                                '23': number;
                                '24': number;
                                '25': number;
                                '26': number;
                                '27': number;
                                '28': number;
                                '29': number;
                                '30': number;
                                '31': number;
                            };
                            minPrice: string;
                        };
                        state: number;
                        bidState: {
                            type: number;
                            bids: any[];
                            max: string;
                        };
                    };
                };
                auctionManager: {
                    pubkey: string;
                    instance: {
                        pubkey: string;
                        account: {
                            executable: boolean;
                            lamports: number;
                            owner: string;
                            rentEpoch: number;
                            data: {
                                type: string;
                                data: number[];
                            };
                        };
                        info: {
                            key: number;
                            store: string;
                            authority: string;
                            auction: string;
                            vault: string;
                            acceptPayment: string;
                            state: {
                                status: number;
                                safetyConfigItemsValidated: string;
                                bidsPushedToAcceptPayment: string;
                                hasParticipation: number;
                            };
                            auctionDataExtended: string;
                        };
                    };
                    numWinners: string;
                    safetyDepositBoxesExpected: string;
                    store: string;
                    authority: string;
                    vault: string;
                    acceptPayment: string;
                    auction: string;
                    status: number;
                    safetyDepositConfigs: any[];
                    bidRedemptions: any[];
                };
                state: string;
                vault: {
                    pubkey: string;
                    account: {
                        executable: boolean;
                        lamports: number;
                        owner: string;
                        rentEpoch: number;
                        data: {
                            type: string;
                            data: number[];
                        };
                    };
                    info: {
                        key: number;
                        tokenProgram: string;
                        fractionMint: string;
                        authority: string;
                        fractionTreasury: string;
                        redeemTreasury: string;
                        allowFurtherShareCreation: number;
                        pricingLookupAddress: string;
                        tokenTypeCount: number;
                        state: number;
                        lockedPricePerShare: string;
                    };
                };
                safetyDepositBoxes: any[];
                items: any[][];
                thumbnail: {
                    metadata: {
                        pubkey: string;
                        account: {
                            executable: boolean;
                            lamports: number;
                            owner: string;
                            rentEpoch: number;
                            data: {
                                type: string;
                                data: number[];
                            };
                        };
                        info: {
                            key: number;
                            updateAuthority: string;
                            mint: string;
                            data: {
                                name: string;
                                symbol: string;
                                uri: string;
                                sellerFeeBasisPoints: number;
                                creators: {
                                    address: string;
                                    verified: number;
                                    share: number;
                                }[];
                            };
                            primarySaleHappened: number;
                            isMutable: number;
                            editionNonce: number;
                            edition: string;
                            masterEdition: string;
                        };
                    };
                };
                isInstantSale: boolean;
                totallyComplete: boolean;
            }[];
        };
    };
}
