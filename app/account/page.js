"use client";
// Denna komponent visar användarens saldo och låter dem sätta in pengar.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Account() {
    const [balance, setBalance] = useState(0); // För att lagra användarens saldo
    const [amount, setAmount] = useState(""); // För att lagra insättningsbeloppet
    const [token, setToken] = useState(""); // För att lagra engångslösenordet
    const [error, setError] = useState(""); // För att lagra felmeddelanden
    const router = useRouter();

    // Hämta användarens saldo från backend
    useEffect(() => {
        const fetchBalance = async () => {
            const storedToken = localStorage.getItem("token"); // Hämta token från localStorage
            if (!storedToken) {
                alert("Du måste logga in för att se denna sida.");
                router.push("/login");
                return;
            }
            setToken(storedToken);

            try {
                const response = await fetch("http://localhost:3001/account", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedToken}`, // Skicka token i Authorization-headern
                    },
                });

                if (!response.ok) {
                    throw new Error("Kunde inte hämta saldo.");
                }

                const data = await response.json();
                setBalance(data.balance); // Uppdatera saldot
            } catch (err) {
                console.error(err.message);
                setError("Ett fel uppstod vid hämtning av saldo. Försök igen senare.");
            }
        };

        fetchBalance();
    }, [router]);

    // Hantera insättning av pengar
    const handleDeposit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/deposit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Skicka token i Authorization-headern
                },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });

            if (!response.ok) {
                throw new Error("Insättning misslyckades.");
            }

            const data = await response.json();
            setBalance(data.newBalance); // Uppdatera saldot med det nya värdet
            alert("Insättningen lyckades!");
            setAmount(""); // Rensa insättningsfältet
        } catch (err) {
            console.error(err.message);
            setError("Ett fel uppstod vid insättningen. Försök igen.");
        }
    };

    // Hantera utloggning
    const handleLogout = () => {
        localStorage.removeItem("token"); // Ta bort token från localStorage
        router.push("/login"); // Skicka användaren till inloggningssidan
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Välkommen till ditt konto</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <p className="text-lg text-gray-700 mb-4">Ditt saldo: <span className="font-bold">{balance} SEK</span></p>
                <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Belopp att sätta in
                        </label>
                        <input
                            id="amount"
                            type="number"
                            placeholder="Ange belopp"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sätt in pengar
                    </button>
                </form>
                <button
                    onClick={handleLogout}
                    className="w-full mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    Logga ut
                </button>
            </div>
        </div>
    );
}