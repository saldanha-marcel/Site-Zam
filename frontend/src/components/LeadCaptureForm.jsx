import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle2 } from 'lucide-react';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/BopncjvofPuK0hVdDpSOQK?mode=gi_t';

export function LeadCaptureForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitted(false);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const payload = {
      nome: data.name,
      idade: Number(data.age),
      cidade: data.city,
      telefone: data.phone,
      email: data.email,
      objetivo: data.goal,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao enviar lead');
      }

      const result = await response.json();
      console.log('Lead capturado:', result);

      setIsSubmitted(true);
      reset();

      setTimeout(() => setIsSubmitted(false), 25000);
    } catch (err) {
      console.error('Falha ao enviar lead:', err);
      const message =
        err.name === 'AbortError'
          ? 'A requisição demorou demais para responder. Verifique a API e tente novamente.'
          : err.message;
      alert(`Falha ao enviar lead: ${message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleOpenGroupLink = () => {
    window.open(WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-black rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-20 rounded-full mb-6" style={{ backgroundColor: '#9FE63E' }}>
            <CheckCircle2 className="size-10 text-black" />
          </div>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#9FE63E', fontWeight: 900 }}>
            🎉 BEM-VINDO AO TIME!
          </h2>
          <p className="text-xl md:text-2xl text-white mb-4" style={{ fontWeight: 600 }}>
            Você está a um passo de destravar seu potencial!
          </p>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-lg mx-auto leading-relaxed">
            Parabéns por dar esse passo importante! Agora você faz parte de um time que não para de evoluir. 
            Entre no nosso grupo exclusivo do WhatsApp para receber todas as novidades sobre o <span style={{ color: '#9FE63E', fontWeight: 700 }}>DESTRAVA 21Z</span> em primeira mão!
          </p>

          <button
            type="button"
            onClick={handleOpenGroupLink}
            className="inline-block w-full md:w-auto px-8 py-4 rounded-lg text-lg text-black transition-all hover:scale-105"
            style={{ backgroundColor: '#9FE63E', fontWeight: 700 }}
          >
            ABRIR GRUPO EM OUTRA ABA
          </button>

          <p className="text-sm text-gray-300 mt-4 max-w-md mx-auto leading-relaxed">
            O link será aberto em outra aba do navegador. Se o celular ainda perguntar sobre acessar outro aplicativo, isso vem do próprio sistema ao detectar um link do WhatsApp.
          </p>

          <p className="text-sm text-gray-400 mt-6">
            Nos vemos lá! 💪
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-black rounded-2xl shadow-2xl p-6 md:p-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-3" style={{ color: '#9FE63E', fontWeight: 900 }}>
          QUERO DESTRAVAR AGORA!
        </h2>
        <p className="text-lg text-white">
          Preencha o formulário e seja um dos primeiros
        </p>
      </div>
      {/* Formulário de captura de leads */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Campo de nome */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base text-white">Nome Completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Digite seu nome completo"
            {...register('name', {
              required: 'Nome é obrigatório',
              minLength: {
                value: 3,
                message: 'Nome deve ter pelo menos 3 caracteres',
              },
            })}
            className={`h-12 text-base bg-white ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-sm" style={{ color: '#9FE63E' }}>{errors.name.message}</p>
          )}
        </div>
        {/* Campos de idade e cidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Campo de idade */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-base text-white">Idade</Label>
            <Input
              id="age"
              type="number"
              placeholder="Sua idade"
              {...register('age', {
                required: 'Idade é obrigatória',
                min: {
                  value: 12,
                  message: 'Idade mínima é 12 anos',
                },
                max: {
                  value: 100,
                  message: 'Por favor, insira uma idade válida',
                },
              })}
              className={`h-12 text-base bg-white ${errors.age ? 'border-red-500' : ''}`}
            />
            {errors.age && (
              <p className="text-sm" style={{ color: '#9FE63E' }}>{errors.age.message}</p>
            )}
          </div>
          {/* Campo de cidade */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-base text-white">Cidade</Label>
            <Input
              id="city"
              type="text"
              placeholder="Sua cidade"
              {...register('city', {
                required: 'Cidade é obrigatória',
              })}
              className={`h-12 text-base bg-white ${errors.city ? 'border-red-500' : ''}`}
            />
            {errors.city && (
              <p className="text-sm" style={{ color: '#9FE63E' }}>{errors.city.message}</p>
            )}
          </div>
        </div>
        {/* Campos de telefone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base text-white">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(00) 00000-0000"
            {...register('phone', {
              required: 'Telefone é obrigatório',
              pattern: {
                value: /^[\d\s()+-]+$/,
                message: 'Telefone inválido',
              },
            })}
            className={`h-12 text-base bg-white ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && (
            <p className="text-sm" style={{ color: '#9FE63E' }}>{errors.phone.message}</p>
          )}
        </div>
        {/* Campo de email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base text-white">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
            className={`h-12 text-base bg-white ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-sm" style={{ color: '#9FE63E' }}>{errors.email.message}</p>
          )}
        </div>
        {/* Select para objetivo */}
        <div className="space-y-2">
          <Label htmlFor="goal" className="text-base text-white">Objetivo</Label>
          <Controller
            name="goal"
            control={control}
            rules={{ required: 'Selecione um objetivo' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={`h-12 text-base bg-white ${errors.goal ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="lazer">Lazer</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.goal && (
            <p className="text-sm" style={{ color: '#9FE63E' }}>{errors.goal.message}</p>
          )}
        </div>
        {/* Botão de envio */}
        <Button
          type="submit"
          className="w-full h-14 text-lg text-black hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#9FE63E', fontWeight: 700 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'GARANTIR MINHA VAGA'}
        </Button>

        <p className="text-center text-sm text-gray-400 mt-4">
          🔒 Seus dados estão seguros conosco
        </p>
      </form>
    </div>
  );
}
