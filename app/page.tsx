"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import ButtonGoogle from "./components/ButtonGoogle";
// import { useAuthCheck } from "@/lib/useAuthCheck";
// import { Selector } from "@/lib/hooks";
// import { selectUser } from "@/features/users/userSlice";

export default function Home() {

  // // 🔥 Déclenche la vérification de session
  //   const { isLoading } = useAuthCheck(); 
  //   const user = Selector(selectUser);

  //   // Si la vérification est en cours OU si la vérification s'est terminée mais que le user est présent (redirection imminente)
  //   if (isLoading || user) {
  //       // Ceci remplace l'affichage "Authentification en cours"
  //       return (
  //           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //               <p>Authentification en cours...</p>
  //               {/* Ajoutez un spinner si vous en avez un */}
  //           </div>
  //       );
  //   }
 

  return (
    <main className="flex flex-col items-center bg-blue-300 w-full justify-center min-h-dvh overflow-hidden">
      <div className="flex flex-col items-center justify-center p-2 w-full md:w-1/2">
        <div className="relative h-[150px] w-[150px] rounded-full overflow-hidden">
          <Image
            src="/assets/logo/meena.png"
            alt="Meena Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-7xl font-bold">MEENA</h1>
        <p className="mb-32">Intelligent social network</p>

        <p className="text-white mb-10 text-center">Notre histoire commence ici : Rejoins notre communauté et ouvre la porte à de nouvelles possibilités.</p>

        <Link href="/inscription" className="w-full flex items-center justify-center"><Button className="bg-blue-950 hover:bg-blue-700 text-white mb-10 rounded-2xl h-[40px] w-3/4">Créer un nouveau compte</Button></Link>
        <div className="flex flex-col items-center w-full gap-1.5">
          <p className="text-white">Déjà membre ?</p>
          <Link href="/connexion" className="w-full flex items-center justify-center"><Button className="bg-white hover:bg-gray-200 w-3/4 rounded-2xl h-[40px] ">Connexion</Button></Link>
        </div>

        <ButtonGoogle />

      </div>
    </main>
  );
}
