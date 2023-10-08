import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  useToastController,
  XStack,
  YStack,
  ListItem,
  YGroup,
  ToggleGroup,
  SizeTokens,
  Label,
  H2,
  H3,
} from '@my/ui'
import { AlarmClock, AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import React, { useEffect, useState } from 'react'
import { useLink } from 'solito/link'
import { addMinutes, format, getHours, getMinutes, parse, parseISO } from 'date-fns'

export function HomeScreen() {
  const [time, setTime] = useState<Date>(HoraAtual())
  const [alarmSelected, setAlarmSelected] = useState<string>('')
  const [alarm, setAlarm] = useState<Date | null>(null)
  const toast = useToastController()

  useEffect(() => {
    const interval = setInterval(() => setTime(HoraAtual()), 1000 * 15)
    return () => clearInterval(interval)
  }, [time])

  function HandleAlarm() {
    const dateSelect = new Date(alarmSelected)
    setAlarm(dateSelect)
    toast.show(`Alarme configurado ${dateSelect.toLocaleString()}`, { native: true })
  }
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4" maw={600}>
        <H3 ta="center"> {FormatedHour(time)}</H3>
      </YStack>
      <Label paddingRight="$0" justifyContent="center" size="$4">
        Se você dormir agora, o melhor momento para acordar é:
      </Label>
      <YStack>
        <XStack alignItems="center">
          <XStack flexDirection="column" alignItems="center" justifyContent="center" space="$4">
            <ToggleGroup
              orientation="vertical"
              type="single"
              size="$8"
              disableDeactivation={true}
              onValueChange={(v) => setAlarmSelected(v)}
            >
              {[1, 2, 3, 4, 5, 6].map((e, k) => {
                const hora = CalculaCiclo(time, e)
                return <AlarmItem hour={hora} key={k} />
              })}
            </ToggleGroup>
          </XStack>
        </XStack>
      </YStack>

      <XStack>
        <Button onPress={() => HandleAlarm()}>Adicionar ao Alarme</Button>
      </XStack>
    </YStack>
  )
}

function HoraAtual() {
  const agora = new Date()
  return agora
}
function FormatedHour(hora: Date) {
  const horaFormatada = format(hora, 'HH:mm')
  return horaFormatada
}

function AlarmItem(props: { hour: Date }) {
  return (
    <>
      <ToggleGroup.Item value={props.hour.toJSON()} {...props} aria-label="Left aligned">
        <XStack space="$2">
          <AlarmClock />
          <Paragraph>{FormatedHour(props.hour)}</Paragraph>
        </XStack>
      </ToggleGroup.Item>
    </>
  )
}

function CalculaCiclo(hora: Date, ciclos: number) {
  const delay = 15
  const cicloSono = 90
  return addMinutes(hora, ciclos * cicloSono + delay)
}
