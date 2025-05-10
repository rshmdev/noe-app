import type React from 'react';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PawPrintIcon as Paw, Upload, Camera, ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { toast } from 'sonner';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import {
  completeRegistration,
  register,
  type FormDataRegister,
} from '~/services/auth';

// Define the form schema for step 1
const step1Schema = z
  .object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    documento: z.string().min(1, 'Documento é obrigatório'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme sua senha'),
    cnh: z.string().optional(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

const step2UsuarioSchema = z
  .object({
    documentoFrente: z
      .instanceof(File, { message: 'Documento frente é obrigatório' })
      .optional()
      .nullable(),
    documentoVerso: z
      .instanceof(File, { message: 'Documento verso é obrigatório' })
      .optional()
      .nullable(),
    selfie: z
      .instanceof(File, { message: 'Selfie é obrigatória' })
      .optional()
      .nullable(),
  })
  .refine((data) => !!data.documentoFrente, {
    message: 'Documento frente é obrigatório',
    path: ['documentoFrente'],
  })
  .refine((data) => !!data.documentoVerso, {
    message: 'Documento verso é obrigatório',
    path: ['documentoVerso'],
  })
  .refine((data) => !!data.selfie, {
    message: 'Selfie é obrigatória',
    path: ['selfie'],
  });

const step2TransportadorSchema = z
  .object({
    tipoVeiculo: z.string().min(1, 'Tipo de veículo é obrigatório'),
    placaVeiculo: z.string().min(1, 'Placa do veículo é obrigatória'),
    documentoVeiculo: z
      .instanceof(File, { message: 'Documento do veículo é obrigatório' })
      .optional()
      .nullable(),
    documentoTransportador: z
      .instanceof(File, { message: 'Documento do transportador é obrigatório' })
      .optional()
      .nullable(),

    selfie: z
      .instanceof(File, { message: 'Selfie é obrigatória' })
      .optional()
      .nullable(),
  })
  .refine((data) => !!data.documentoVeiculo, {
    message: 'Documento do veículo é obrigatório',
    path: ['documentoVeiculo'],
  })
  .refine((data) => !!data.selfie, {
    message: 'Selfie é obrigatória',
    path: ['selfie'],
  });

type CaptureModalFieldUsuario = keyof z.infer<typeof step2UsuarioSchema>;
type CaptureModalFieldTransportador = keyof z.infer<
  typeof step2TransportadorSchema
>;

type CaptureModalField =
  | CaptureModalFieldUsuario
  | CaptureModalFieldTransportador;

export default function Register() {
  const [searchParams] = useSearchParams();

  const tipoParam = searchParams.get('tipo') || 'usuario';

  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [tipoUsuario, setTipoUsuario] = useState<'usuario' | 'transportador'>(
    tipoParam === 'transportador' ? 'transportador' : 'usuario',
  );

  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      documento: '',
      cnh: '',
    },
  });

  const step2UsuarioForm = useForm<z.infer<typeof step2UsuarioSchema>>({
    resolver: zodResolver(step2UsuarioSchema),
    defaultValues: {
      documentoFrente: null,
      documentoVerso: null,
      selfie: null,
    },
  });

  const step2TransportadorForm = useForm<
    z.infer<typeof step2TransportadorSchema>
  >({
    resolver: zodResolver(step2TransportadorSchema),
    defaultValues: {
      tipoVeiculo: '',
      placaVeiculo: '',
      documentoVeiculo: null,
      documentoTransportador: null,
      selfie: null,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: FormDataRegister) => {
      return await register(data);
    },
    onSuccess: (data) => {
      console.log('data', data);
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      toast('Cadastro realizado com sucesso!');
      step1Form.reset();
      setStep(2);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    },
  });

  const { mutateAsync: completeRegistrationMutate } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await completeRegistration({
        data: data,
      });

      return res;
    },
    onSuccess: () => {
      setIsLoading(false);
      step2UsuarioForm.reset();
      step2TransportadorForm.reset();
      setStep(1);
      navigate('/', { replace: true });
      toast('Cadastro completo!');
    },
    onError: () => {
      setIsLoading(false);
      toast.error('Erro ao completar cadastro. Tente novamente.');
    },
  });

  const onSubmitStep1 = async (data: z.infer<typeof step1Schema>) => {
    setIsLoading(true);
    await mutateAsync({
      email: data.email,
      password: data.senha,
      name: data.nome,
      cpf: tipoUsuario === 'usuario' ? data.documento : undefined,
      cnpj: tipoUsuario === 'transportador' ? data.documento : undefined,
      cnh: tipoUsuario === 'transportador' ? data.cnh : undefined,
      role: tipoUsuario === 'usuario' ? 'NORMAL' : 'TRANSPORTER',
      vehicleInfo: tipoUsuario === 'transportador' ? data.cnh : undefined,
    });
  };

  const onSubmitStep2Usuario = async (
    data: z.infer<typeof step2UsuarioSchema>,
  ) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('document_front', data.documentoFrente as File);
    formData.append('document_back', data.documentoVerso as File);
    formData.append('selfie', data.selfie as File);

    await completeRegistrationMutate(formData);
  };

  const onSubmitStep2Transportador = async (
    data: z.infer<typeof step2TransportadorSchema>,
  ) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('cnh_image', data.documentoTransportador as File);
    formData.append('vehicle_doc', data.documentoVeiculo as File);
    formData.append('selfie', data.selfie as File);
    formData.append('vehicleType', data.tipoVeiculo);
    formData.append('vehiclePlate', data.placaVeiculo);

    await completeRegistrationMutate(formData);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    form: any,
  ) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue(fieldName, e.target.files[0], { shouldValidate: true });
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Paw className="h-8 w-8 text-green-400" />
        <h1 className="text-2xl font-bold text-white">App NOÉ</h1>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro</CardTitle>
          <CardDescription className="">
            Crie sua conta para começar a usar o App NOÉ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={tipoUsuario}
            onValueChange={(value) =>
              setTipoUsuario(value as 'usuario' | 'transportador')
            }
            className="mb-6 w-full"
          >
            <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
              <TabsTrigger disabled={step !== 1} value="usuario">
                Sou Tutor
              </TabsTrigger>
              <TabsTrigger disabled={step !== 1} value="transportador">
                Sou Transportador
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {step === 1 ? (
            <Form {...step1Form}>
              <form
                onSubmit={step1Form.handleSubmit(onSubmitStep1)}
                className="space-y-4"
              >
                <FormField
                  control={step1Form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step1Form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step1Form.control}
                  name="documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tipoUsuario === 'usuario' ? 'CPF' : 'CNPJ'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            tipoUsuario === 'usuario'
                              ? '000.000.000-00'
                              : '00.000.000/0000-00'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {tipoUsuario === 'transportador' && (
                  <FormField
                    control={step1Form.control}
                    name="cnh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da CNH</FormLabel>
                        <FormControl>
                          <Input placeholder="00000000000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={step1Form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step1Form.control}
                  name="confirmarSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Processando...' : 'Próximo'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : tipoUsuario === 'usuario' ? (
            <Form {...step2UsuarioForm}>
              <form
                onSubmit={step2UsuarioForm.handleSubmit(onSubmitStep2Usuario)}
                className="space-y-4"
              >
                <FormField
                  control={step2UsuarioForm.control}
                  name="documentoFrente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento (frente)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                'documentoFrente',
                                step2UsuarioForm,
                              )
                            }
                            className="hidden"
                            id="documentoFrente"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() =>
                              document
                                .getElementById('documentoFrente')
                                ?.click()
                            }
                          >
                            <Upload className="h-4 w-4" />
                            {field.value
                              ? (field.value as File).name
                              : 'Selecionar arquivo'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step2UsuarioForm.control}
                  name="documentoVerso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento (verso)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2  overflow-hidden">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                'documentoVerso',
                                step2UsuarioForm,
                              )
                            }
                            className="hidden"
                            id="documentoVerso"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() =>
                              document.getElementById('documentoVerso')?.click()
                            }
                          >
                            <Upload className="h-4 w-4" />
                            {field.value
                              ? (field.value as File).name
                              : 'Selecionar arquivo'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step2UsuarioForm.control}
                  name="selfie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selfie segurando documento (reconhecimento facial)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2  overflow-hidden">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, 'selfie', step2UsuarioForm)
                            }
                            className="hidden"
                            id="selfie"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() =>
                              document.getElementById('selfie')?.click()
                            }
                          >
                            <Camera className="h-4 w-4" />
                            {field.value
                              ? (field.value as File).name
                              : 'Tirar selfie'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Processando...' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...step2TransportadorForm}>
              <form
                onSubmit={step2TransportadorForm.handleSubmit(
                  onSubmitStep2Transportador,
                )}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={step2TransportadorForm.control}
                    name="tipoVeiculo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de veículo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="carro">Carro</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="caminhao">Caminhão</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2TransportadorForm.control}
                    name="placaVeiculo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa do veículo</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={step2TransportadorForm.control}
                  name="documentoVeiculo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento do veículo</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2  overflow-hidden">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                'documentoVeiculo',
                                step2TransportadorForm,
                              )
                            }
                            className="hidden"
                            id="documentoVeiculo"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() =>
                              document
                                .getElementById('documentoVeiculo')
                                ?.click()
                            }
                          >
                            <Upload className="h-4 w-4" />
                            {field.value
                              ? (field.value as File).name
                              : 'Selecionar arquivo'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step2TransportadorForm.control}
                  name="documentoTransportador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNH</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2  overflow-hidden">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                'documentoTransportador',
                                step2TransportadorForm,
                              )
                            }
                            className="hidden"
                            id="cnh"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() =>
                              document.getElementById('cnh')?.click()
                            }
                          >
                            <Camera className="h-4 w-4" />
                            {field.value
                              ? (field.value as File).name
                              : 'Tirar foto'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step2TransportadorForm.control}
                  name="selfie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selfie com CNH (reconhecimento facial)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2  overflow-hidden">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                'selfie',
                                step2TransportadorForm,
                              )
                            }
                            className="hidden"
                            id="selfie-transportador"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() =>
                              document
                                .getElementById('selfie-transportador')
                                ?.click()
                            }
                          >
                            <Camera className="h-4 w-4" />
                            {field.value
                              ? (field.value as File).name
                              : 'Tirar selfie'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Processando...' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <p>
            Já tem uma conta? <Link to="/auth/login">Faça login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
