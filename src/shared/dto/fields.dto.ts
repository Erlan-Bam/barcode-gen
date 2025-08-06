export type InputField = {
    title: string
    abr: string
    type: string
    value: string
    pattern?: string
    random?: boolean
    randomHandler?: object
    calculate?: boolean
    calculateHandler?: object
}
export type InputFieldArgs = {
    t: string
    a: string
    p?: string
    r?: boolean
    rh?: { [index: string]: string[] }
    c?: boolean
    ch?: { [index: string]: string[] }
    v?: string
}
export type RadioField = {
    title: string
    abr: string
    type: string
    values?: Record<string, number>
}
export type RadioFieldArgs = {
    t: string
    a: string
    values?: Record<string, number>
}
export type SelectField = {
    title: string
    abr: string
    onChangeSend: string[]
    type: string
    values?: Record<string, string>
    selected: string
}
export type SelectFieldArgs = {
    t: string
    a: string
    values: Record<string, string>
    oCS?: string[]
}
export type IconField = {
    title: string
    abr: string
    value: number
    type: string
    icon?: string
}
export type IconFieldArgs = {
    t: string
    abr: string
    v?: number
    i: string
}
export type CalendarField = {
    title: string
    abr: string
    type: string
    alt: string
    value: string
    random?: boolean
    randomHandler?: { [index: string]: string[] }
    calculate?: boolean
    calculateHandler?: { [index: string]: string[] }
}

export type CalendarFieldArgs = {
    t: string
    a: string
    alt?: string
    r?: boolean
    rh?: { [index: string]: string[] }
    c?: boolean
    ch?: { [index: string]: string[] }
    v?: string
}
export type ChoiserField = {
    title: string
    abr: string
    type: string
    alt?: string
    values: Record<string, string>
    onChangeSend?: string[]
}
export type ChoiserFieldArgs = {
    t: string
    a: string
    alt?: string
    v?: Record<any, any>
    oCS?: string[]
}