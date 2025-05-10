'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Info, Loader2, MapPin, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createRoute } from '~/services/route';
import ProtectedRoute from '~/components/protected-route';

const formSchema = z.object({
  origin: z.string().min(3),
  originDate: z.date(),
  destination: z.string().min(3),
  destinationDate: z.date(),
  availableSlots: z.number(),
  vehicleObservations: z.string().min(5),
  speciesAccepted: z.array(z.string()),
  animalSizeAccepted: z.array(z.string()),
  stops: z.array(
    z.object({
      location: z.string().min(3),
      arrivalTime: z.date(),
      departureTime: z.date(),
      notes: z.string().optional(),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function CadastroRotaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paradasSugeridas, setParadasSugeridas] = useState<
    { local: string; tipo: string; tempo: string }[]
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: '',
      originDate: new Date(),
      destination: '',
      destinationDate: new Date(),
      availableSlots: 1,
      vehicleObservations: '',
      speciesAccepted: [],
      animalSizeAccepted: [],
      stops: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stops',
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: FormValues) => {
      await createRoute(data);
      return data;
    },
    onSuccess: () => {
      toast('Rota cadastrada com sucesso!');
      form.reset();
      setParadasSugeridas([]);
    },
    onError: () => {
      alert('Erro ao cadastrar rota. Tente novamente.');
    },
  });

  const dataPartida = form.watch('originDate');
  const dataChegada = form.watch('destinationDate');

  useEffect(() => {
    if (!dataPartida || !dataChegada) return;

    const diferencaHoras =
      Math.abs(dataChegada.getTime() - dataPartida.getTime()) / 36e5;

    if (diferencaHoras <= 12) {
      setParadasSugeridas([]);
      return;
    }

    const numParadas = Math.floor(diferencaHoras / 12);
    const novasParadas: typeof paradasSugeridas = [];

    for (let i = 1; i <= numParadas; i++) {
      const horaAlvo = new Date(
        dataPartida.getTime() + i * 12 * 60 * 60 * 1000,
      );

      const jaExisteParadaProxima = fields?.some((p) => {
        const chegada = new Date(p.arrivalTime).getTime();
        const saida = new Date(p.departureTime).getTime();
        const alvo = horaAlvo.getTime();

        return alvo >= chegada && alvo <= saida;
      });

      if (!jaExisteParadaProxima) {
        novasParadas.push({
          local: `Sugestão de parada ${i}`,
          tipo: 'Alimentação e descanso dos animais',
          tempo: format(horaAlvo, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        });
      }
    }

    setParadasSugeridas(novasParadas);
  }, [dataPartida, dataChegada, fields]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      await mutateAsync(data);
    } catch (error) {
      toast('Erro ao cadastrar rota. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['TRANSPORTER']}>
      <Card className="w-full mx-auto shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Cadastro de Rota</CardTitle>
          <CardDescription>
            Cadastre uma nova rota de transporte de animais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
                className="w-full"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-base font-medium">
                    Origem e Destino
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 px-2">
                    <div className="space-y-4">
                      {/* Origem */}
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Origem *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cidade/Estado de origem"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Data de Partida */}
                      <FormField
                        control={form.control}
                        name="originDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de Partida *</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                value={
                                  field.value
                                    ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                                    : ''
                                }
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Destino */}
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destino *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cidade/Estado de destino"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Data de Chegada */}
                      <FormField
                        control={form.control}
                        name="destinationDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data Prevista de Chegada *</FormLabel>

                            <FormControl>
                              <Input
                                type="datetime-local"
                                value={
                                  field.value
                                    ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                                    : ''
                                }
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-base font-medium">
                    Paradas
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel>Lista de Paradas *</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            append({
                              location: '',
                              arrivalTime: new Date(),
                              departureTime: new Date(),
                              notes: '',
                            })
                          }
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          <span className="text-sm">Adicionar</span>
                        </Button>
                      </div>

                      {fields.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          Nenhuma parada adicionada. Clique em "Adicionar" para
                          incluir paradas.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="p-3 border rounded-md relative"
                            >
                              <div className="absolute right-2 top-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                  className="h-6 w-6"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="space-y-3 pr-8">
                                <FormField
                                  control={form.control}
                                  name={`stops.${index}.location`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm">
                                        Local
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Local da parada"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`stops.${index}.arrivalTime`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Chegada</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="datetime-local"
                                          value={
                                            field.value
                                              ? format(
                                                  field.value,
                                                  "yyyy-MM-dd'T'HH:mm",
                                                )
                                              : ''
                                          }
                                          onChange={(e) =>
                                            field.onChange(
                                              new Date(e.target.value),
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`stops.${index}.departureTime`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm">
                                        Partida
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="datetime-local"
                                          value={
                                            field.value
                                              ? format(
                                                  field.value,
                                                  "yyyy-MM-dd'T'HH:mm",
                                                )
                                              : ''
                                          }
                                          onChange={(e) =>
                                            field.onChange(
                                              new Date(e.target.value),
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`stops.${index}.notes`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm">
                                        Descrição (opcional)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Descrição da parada"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Paradas Obrigatórias Calculadas */}
                      {paradasSugeridas.length > 0 && (
                        <Alert className="mt-4">
                          <MapPin className="h-4 w-4" />
                          <AlertTitle>Paradas Sugeridas</AlertTitle>
                          <AlertDescription>
                            <p className="mb-2 text-sm">
                              Com base no tempo estimado de viagem, sugerimos as
                              seguintes paradas para o bem-estar dos animais:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {paradasSugeridas.map((parada, index) => (
                                <li key={index}>
                                  <span className="font-medium">
                                    {parada.local}
                                  </span>
                                  : {parada.tipo} - {parada.tempo}
                                </li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-base font-medium">
                    Informações do Veículo
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="space-y-4">
                      {/* Vagas no Veículo */}
                      <FormField
                        control={form.control}
                        name="availableSlots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade de Vagas *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                onChange={(e) => {
                                  const value = parseInt(e.target.value, 10);
                                  field.onChange(isNaN(value) ? 1 : value);
                                }}
                                placeholder="Número de vagas"
                                value={field.value}
                                onBlur={field.onBlur}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Observações do Veículo */}
                      <FormField
                        control={form.control}
                        name="vehicleObservations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações do Veículo *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva detalhes sobre o veículo (modelo, adaptações para animais, etc.)"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-base font-medium">
                    Informações dos Animais
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="space-y-4">
                      {/* Porte dos Animais */}
                      <FormField
                        control={form.control}
                        name="animalSizeAccepted"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Porte dos Animais *</FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { value: 'pequeno', label: 'Pequeno' },
                                { value: 'medio', label: 'Médio' },
                                { value: 'grande', label: 'Grande' },
                              ].map((porte) => (
                                <div
                                  key={porte.value}
                                  className={`border rounded-md p-3 text-center cursor-pointer transition-colors ${
                                    field.value?.includes(porte.value)
                                      ? 'bg-primary/10 border-primary'
                                      : 'hover:bg-muted'
                                  }`}
                                  onClick={() => {
                                    const updatedValue = field.value?.includes(
                                      porte.value,
                                    )
                                      ? field.value.filter(
                                          (item) => item !== porte.value,
                                        )
                                      : [...(field.value || []), porte.value];
                                    field.onChange(updatedValue);
                                  }}
                                >
                                  {porte.label}
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Espécies */}
                      <FormField
                        control={form.control}
                        name="speciesAccepted"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Espécies *</FormLabel>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {[
                                { value: 'cachorro', label: 'Cachorro' },
                                { value: 'gato', label: 'Gato' },
                                { value: 'ave', label: 'Ave' },
                                { value: 'roedor', label: 'Roedor' },
                                { value: 'outro', label: 'Outro' },
                              ].map((especie) => (
                                <div
                                  key={especie.value}
                                  className={`border rounded-md p-3 text-center cursor-pointer transition-colors ${
                                    field.value?.includes(especie.value)
                                      ? 'bg-primary/10 border-primary'
                                      : 'hover:bg-muted'
                                  }`}
                                  onClick={() => {
                                    const updatedValue = field.value?.includes(
                                      especie.value,
                                    )
                                      ? field.value.filter(
                                          (item) => item !== especie.value,
                                        )
                                      : [...(field.value || []), especie.value];
                                    field.onChange(updatedValue);
                                  }}
                                >
                                  {especie.label}
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Preço */}
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Info className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Preço a consultar (será definido após análise)
                          </span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Rota'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ProtectedRoute>
  );
}
