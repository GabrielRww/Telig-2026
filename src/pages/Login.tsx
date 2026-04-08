import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, LogIn, Radio, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao entrar", description: "E-mail ou senha incorretos." });
    } else {
      navigate("/");
    }
  };

  const features = [
    { icon: Shield, label: "Segurança", desc: "Controle total de acesso e auditoria" },
    { icon: Radio, label: "TJammer", desc: "Integração com contrasenhas em tempo real" },
    { icon: Cpu, label: "Automação", desc: "Transferências automáticas de equipamentos" },
    { icon: Zap, label: "Performance", desc: "Gestão de 188k+ ordens de serviço" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Branding */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(240 22% 8%) 0%, hsl(240 20% 14%) 50%, hsl(213 80% 20%) 100%)" }}
      >
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(hsl(213 100% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(213 100% 60%) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        
        {/* Glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(213 100% 50% / 0.3), transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(213 100% 40% / 0.2), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white">
              TELIG <span className="text-primary">:)</span>
            </h1>
            <p className="text-sm text-white/40 mt-1 tracking-widest uppercase">Sistema de Gestão Operacional</p>
          </motion.div>

          {/* Hero text */}
          <div className="space-y-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-semibold text-white leading-tight">
                Gestão completa de<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  ordens de serviço
                </span>
              </h2>
              <p className="text-white/50 mt-4 text-lg max-w-md leading-relaxed">
                Plataforma integrada para controle de OS, equipamentos, veículos e equipes técnicas da Saeggo do Brasil.
              </p>
            </motion.div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
                >
                  <div className="p-2 rounded-lg bg-primary/20">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90">{f.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-3"
          >
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-xs text-white/30">Saeggo do Brasil © 2025</p>
            <div className="h-px flex-1 bg-white/10" />
          </motion.div>
        </div>
      </motion.div>

      {/* Right panel - Login form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-8 bg-background"
      >
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-foreground">
              TELIG <span className="text-primary">:)</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Sistema de Gestão Operacional</p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-semibold text-foreground">Bem-vindo de volta</h2>
            <p className="text-muted-foreground text-sm">Entre com suas credenciais para acessar o sistema</p>
          </motion.div>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-card border-border/60 focus-visible:ring-primary/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-card border-border/60 pr-10 focus-visible:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Cpu size={16} />
                    </motion.div>
                    Entrando...
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <LogIn size={16} />
                    Entrar
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-muted-foreground/60"
          >
            Acesso restrito a colaboradores autorizados
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
