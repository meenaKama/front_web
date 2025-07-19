import React from 'react'
import Image from 'next/image'
import Login from '../connexion/components/Login'

const Connexion = () => {
  return (
    <main className="flex flex-col items-center bg-blue-300 w-full justify-center min-h-dvh overflow-hidden">
      {/* Partie mobile */}
      <div className="flex lg:hidden flex-col items-center justify-center p-2 w-full">
        <div className="relative h-[200px] w-[200px] rounded-full overflow-hidden">
          <Image
            src="/assets/logo/meena.png"
            alt="Meena Logo"
            fill
            className="object-contain"
            priority

          />
        </div>
        <Login />
        <p className="text-center text-sm mt-2 relative -bottom-1/3">
          ⓒ Meena, Inc. Tous droits réservés.
        </p>

      </div>

      {/* Partie desktop */}
      <div className="hidden lg:block">
        <h1 className="text-4xl font-bold">Meena desktop est en cours de production</h1>
      </div>

    </main>
  )
}

export default Connexion