"use client"
import { registerBones } from 'boneyard-js/react'

const bonesModules = import.meta.glob('./*.bones.json', { eager: true })

const bones = {}
for (const [path, module] of Object.entries(bonesModules)) {
  const name = path.replace(/^\.\//, '').replace(/\.bones\.json$/, '')
  bones[name] = module.default
}

registerBones(bones)
