import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase.js"; // Ajustado pro seu firebase modular
import { registerUser, loginUser } from "../firebase/auth.js";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore modular
import { CreditCard, Mail, Phone, Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function Profile() {
  // Estados gerais
  const [activeSection, setActiveSection] = useState("main"); // main / withdraw / deposit
  const [user, setUser] = useState({ uid: "", name: "", email: "", balance: 0 });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // PIX
  const [pixType, setPixType] = useState("cpf");
  const [pixKey, setPixKey] = useState("");

  // Saque
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showError, setShowError] = useState("");
  const [showSuccess, setShowSuccess] = useState("");

  // Depósito
  const [depositAmount, setDepositAmount] = useState("");

  // Mock: Horário de saque permitido (08:00 - 20:00)
  const canWithdrawNow = () => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour <= 20) return { allowed: true };
    return { allowed: false, message: "Saque disponível entre 08:00 e 20:00" };
  };

  // Atualiza dados do usuário
  const fetchUser = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser({ uid, ...docSnap.data() });
    }
  };

  // Cadastro
  const handleSignup = async () => {
    try {
      const newUser = await registerUser(name, email, password);
      await fetchUser(newUser.uid);
      setActiveSection("main");
    } catch (err) {
      alert(err.message);
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setActiveSection("main");
    } catch (err) {
      alert(err.message);
    }
  };

  // Solicitar saque
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount > user.balance) {
      setShowError("Valor inválido ou saldo insuficiente");
      return;
    }

    const fee = amount * 0.1;
    const net = amount - fee;

    const newBalance = user.balance - amount;
    await updateDoc(doc(db, "users", user.uid), { balance: newBalance });
    setUser({ ...user, balance: newBalance });
    setShowSuccess(`Saque de R$ ${net.toFixed(2)} solicitado com sucesso!`);
    setWithdrawAmount("");
  };

  // Depositar (simulado)
  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount) {
      setShowError("Valor inválido");
      return;
    }

    const newBalance = user.balance + amount;
    await updateDoc(doc(db, "users", user.uid), { balance: newBalance });
    setUser({ ...user, balance: newBalance });
    setShowSuccess(`Depósito de R$ ${amount.toFixed(2)} realizado!`);
    setDepositAmount("");
  };

  // Render principal
  const renderMain = () => (
    <div className="animate-slide-up">
      <h2 className="text-xl font-bold text-white mb-6">Bem-vindo(a), {user.name || "usuário"}</h2>
      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Saldo disponível</span>
          <span className="text-white font-bold">R$ {user.balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setActiveSection("withdraw")} className="btn-primary flex-1">
          Sacar
        </button>
        <button onClick={() => setActiveSection("deposit")} className="btn-secondary flex-1">
          Depositar
        </button>
      </div>
    </div>
  );

  // Render saque
  const renderWithdraw = () => {
    const withdrawCheck = canWithdrawNow();
    const fee = parseFloat(withdrawAmount) * 0.1 || 0;
    const netAmount = (parseFloat(withdrawAmount) || 0) - fee;

    return (
      <div className="animate-slide-up">
        <button
          onClick={() => {
            setActiveSection("main");
            setWithdrawAmount("");
            setPixKey("");
            setShowError("");
            setShowSuccess("");
          }}
          className="text-gray-400 mb-4 hover:text-white transition-colors"
        >
          ← Voltar
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Sacar via PIX</h2>

        {!withdrawCheck.allowed && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4 flex items-start gap-3 animate-slide-down">
            <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm">Fora do horário de saque</p>
              <p className="text-gray-400 text-xs">{withdrawCheck.message}</p>
            </div>
          </div>
        )}

        {showError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 flex items-center gap-3 animate-slide-down">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-400 text-sm">{showError}</p>
          </div>
        )}

        {showSuccess && (
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-4 flex items-center gap-3 animate-slide-down">
            <CheckCircle className="w-5 h-5 text-primary-500" />
            <p className="text-primary-400 text-sm">{showSuccess}</p>
          </div>
        )}

        <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Valor do saque</label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="R$ 0,00"
            className="w-full bg-dark-600 border border-dark-500 rounded-xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-all"
          />
        </div>

        {/* BLOCO PIX COMEÇA AQUI */}
        <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-4">
          <label className="text-gray-400 text-sm mb-3 block">Tipo de chave PIX</label>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setPixType("cpf")}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                pixType === "cpf" ? "bg-primary-500/20 border border-primary-500" : "bg-dark-600 border border-dark-500"
              }`}
            >
              <CreditCard className={`w-5 h-5 ${pixType === "cpf" ? "text-primary-500" : "text-gray-400"}`} />
              <span className={`text-xs ${pixType === "cpf" ? "text-primary-400" : "text-gray-400"}`}>CPF</span>
            </button>

            <button
              onClick={() => setPixType("email")}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                pixType === "email" ? "bg-primary-500/20 border border-primary-500" : "bg-dark-600 border border-dark-500"
              }`}
            >
              <Mail className={`w-5 h-5 ${pixType === "email" ? "text-primary-500" : "text-gray-400"}`} />
              <span className={`text-xs ${pixType === "email" ? "text-primary-400" : "text-gray-400"}`}>Email</span>
            </button>

            <button
              onClick={() => setPixType("phone")}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                pixType === "phone" ? "bg-primary-500/20 border border-primary-500" : "bg-dark-600 border border-dark-500"
              }`}
            >
              <Phone className={`w-5 h-5 ${pixType === "phone" ? "text-primary-500" : "text-gray-400"}`} />
              <span className={`text-xs ${pixType === "phone" ? "text-primary-400" : "text-gray-400"}`}>Telefone</span>
            </button>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Chave PIX ({pixType.toUpperCase()})
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder={
                pixType === "cpf" ? "000.000.000-00" :
                pixType === "email" ? "seu@email.com" :
                "(00) 00000-0000"
              }
              className="w-full bg-dark-600 border border-dark-500 rounded-xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          className="w-full bg-primary-500 text-white py-3 rounded-xl mt-2 hover:bg-primary-600 transition-colors"
        >
          Solicitar saque
        </button>
      </div>
    );
  };

  // Render depósito
  const renderDeposit = () => (
    <div className="animate-slide-up">
      <button
        onClick={() => {
          setActiveSection("main");
          setDepositAmount("");
          setShowError("");
          setShowSuccess("");
        }}
        className="text-gray-400 mb-4 hover:text-white transition-colors"
      >
        ← Voltar
      </button>

      <h2 className="text-xl font-bold text-white mb-6">Depósito</h2>

      {showError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 flex items-center gap-3 animate-slide-down">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-400 text-sm">{showError}</p>
        </div>
      )}

      {showSuccess && (
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-4 flex items-center gap-3 animate-slide-down">
          <CheckCircle className="w-5 h-5 text-primary-500" />
          <p className="text-primary-400 text-sm">{showSuccess}</p>
        </div>
      )}

      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-4">
        <label className="text-gray-400 text-sm mb-2 block">Valor do depósito</label>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="R$ 0,00"
          className="w-full bg-dark-600 border border-dark-500 rounded-xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-all"
        />
      </div>

      <button
        onClick={handleDeposit}
        className="w-full bg-primary-500 text-white py-3 rounded-xl mt-2 hover:bg-primary-600 transition-colors"
      >
        Depositar
      </button>
    </div>
  );

  // Render login/cadastro
  const renderAuth = () => (
    <div className="animate-slide-up max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-white mb-6">Login / Cadastro</h2>

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-dark-600 border border-dark-500 rounded-xl py-3 px-4 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-primary-500 transition-all"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-dark-600 border border-dark-500 rounded-xl py-3 px-4 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-primary-500 transition-all"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-dark-600 border border-dark-500 rounded-xl py-3 px-4 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-primary-500 transition-all"
      />

      <div className="flex gap-2">
        <button onClick={handleSignup} className="btn-primary flex-1">
          Cadastrar
        </button>
        <button onClick={handleLogin} className="btn-secondary flex-1">
          Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-dark-800">
      {!user.uid ? renderAuth() : activeSection === "main" ? renderMain() : activeSection === "withdraw" ? renderWithdraw() : renderDeposit()}
    </div>
  );
}
