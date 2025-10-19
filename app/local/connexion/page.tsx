import React from 'react'
import Image from 'next/image'
import Login from '../connexion/components/Login'

const Connexion = () => {
  return (
    <main className="flex flex-col items-center bg-blue-300 w-full justify-center min-h-dvh overflow-hidden">
      <div className="flex flex-col items-center justify-center p-2 w-full">
        <div className="relative h-[200px] w-[200px] rounded-full overflow-hidden">
          <Image
            src="/assets/logo/meena.png"
            alt="Meena Logo"
            fill
            sizes="150px"
            className="object-contain"
            priority

          />
        </div>
        <Login />
        <p className="text-center text-sm mt-2 relative -bottom-1/3">
          ⓒ Meena, Inc. Tous droits réservés.
        </p>

      </div>
    </main>
  )
}

export default Connexion