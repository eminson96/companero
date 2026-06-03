"use client";
import React, { useState, useEffect } from "react";
import {
  Star, MapPin, ShieldCheck, ArrowRight, ArrowLeft, Globe, Car, Check,
  Compass, Menu, X, Search, Users, MessageCircle, Sparkles, Heart,
  Bike, Footprints, Camera,
} from "lucide-react";
import { supabase } from "./supabaseClient";

/* ============================== THEME ============================== */
const C = {
  bg: "#FCFBF8", surface: "#FFFFFF", ink: "#21251F", inkSoft: "#6E6A5F", inkDim: "#9A9488",
  line: "#ECE8DF", lineSoft: "#F3F0E9", coral: "#F15B45", coralDeep: "#D6432E", teal: "#2AA597",
  shadow: "0 12px 30px -16px rgba(33,37,31,.22)", shadowHi: "0 24px 50px -24px rgba(33,37,31,.32)",
};
const HEAD = "'Schibsted Grotesk', system-ui, sans-serif";
const BODY = "'Hanken Grotesk', system-ui, sans-serif";
const TINTS = [
  { tint: "#E7F3F1", ink: "#1D7A70" }, { tint: "#FBEDE4", ink: "#B65A2C" },
  { tint: "#EBF2E7", ink: "#4C7A3C" }, { tint: "#F0EDF6", ink: "#6B5AA0" },
];
const tintFor = (i) => TINTS[i % TINTS.length];
const MODES = { car: { icon: Car, key: "mCar" }, bike: { icon: Bike, key: "mBike" }, walk: { icon: Footprints, key: "mWalk" } };

/* ============================== I18N ============================== */
const LANGS = [
  { code: "en", label: "English" }, { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" }, { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" }, { code: "ro", label: "Română" },
  { code: "ru", label: "Русский" }, { code: "uk", label: "Українська" },
];
const TR = {
  en: { meet: "Meet a Compañero", become: "Become a Compañero",
    heroBadge: "Real locals · Real Tenerife", heroA: "Find your Compañero to ", heroB: "experience Tenerife.",
    heroSub: "A local companion for your day on the island — hidden coves, family wine-shacks, cliffs and stars. Private, personal, nothing like a coach tour.",
    howTitle: "Three steps to a perfect island day", howSub: "Simple, safe, and built around real people.",
    s1t: "Meet your Compañero", s1d: "Browse local companions and the days they love to share. Every one is a verified local.",
    s2t: "Agree on your day", s2d: "Message your Compañero, shape the plan together, and book securely through the app.",
    s3t: "Live it together", s3d: "Meet up and explore. Afterwards you leave a review — that's what keeps Compañero real.",
    compTitle: "Meet the Compañeros", compSub: "Locals ready to show you their Tenerife.",
    emptyTitle: "No Compañeros yet", emptyDesc: "Be the first local to share the island. Once you join, your profile appears right here.", emptyBtn: "Become the first Compañero",
    travPill: "For travellers", travTitle: "The day you'll talk about when you get home.",
    travBody: "Not the resort, not the queue for the cable car — the afternoon a local took you somewhere you'd never have found, and the island finally felt like yours.",
    back: "Back", verified: "Verified", hasCar: "Has a car", loveShare: "What I love to share", reviews: "Reviews",
    noReviews: "No reviews yet — be the first to go out with {name} and leave one.",
    goOut: "Go out with {name}", goOutDesc: "Send a request and agree on the day together. You only pay once you both confirm the plan.",
    sendReq: "Send a request", secureNote: "Payments are held securely and released after your day.",
    becomePill: "For locals", becomeTitle: "Share the Tenerife you love.",
    becomeSub: "You don't need a tour-guide licence — you're a companion, not a guide. Choose your days, write your own plans, and be valued fairly for your time.",
    formAbout: "Tell us about you", fName: "Your name", fArea: "Where on the island are you?", fAbout: "What would you love to share?",
    fAboutPh: "Hidden beaches, surf, guachinches, stargazing… write it your way.", fCar: "Do you have a car for your days?", photo: "Profile photo", photoCta: "Add a photo", getAround: "How do you like to get around?", mCar: "By car", mBike: "By bike", mWalk: "On foot",
    yes: "Yes", no: "Not needed",
    terms: "I'm 18 or older and agree to the host terms — Compañero is for sharing experiences and good company.", submit: "Submit application",
    welcome: "Welcome aboard, {name}.", welcomeSub: "Your profile is live on the home page. Here's what happens next:",
    n1t: "A quick video call", n1d: "A 10-minute chat so we know you're the real deal — it's what keeps Compañero trusted.",
    n2t: "ID & autónomo check", n2d: "We verify your ID (18+) and help you sort the paperwork to invoice legally.",
    n3t: "Start hosting", n3d: "Travellers can find you, request a day, and pay securely through the app.", seeProfile: "See my profile",
    reqTitle: "Send a request to {name}", reqBody: "You'll be able to message {name}, agree on the day and plan, and pay securely once you both confirm.",
    cancel: "Cancel", sendRequest: "Send request", sentTitle: "Request sent!",
    sentBody: "{name} will get back to you soon. You can plan the day together in your messages.", backHome: "Back home",
    fTrust: "Trust & safety", fContact: "Contact", rights: "Verified locals · Secure payments · 18+", copyright: "© {year} Compañero · Tenerife, Canary Islands", login: "Log in", signup: "Sign up", logout: "Log out", dashboard: "Dashboard", email: "Email", password: "Password", welcomeBack: "Welcome back", createAccount: "Create your account", toSignup: "New here? Create an account", toLogin: "Already have an account? Log in", pending: "Pending review", loginToContinue: "Please log in to continue.", dashTitle: "Your dashboard", dashHi: "Signed in as {email}", dashProfile: "Your Compañero profile", dashNoProfile: "You haven't created a Compañero profile yet.", dashBecomeCta: "Create your profile", dashSetup: "Getting set up", dashStep1: "Profile created", dashStep2: "Get verified", dashStep2sub: "We'll invite you to a short video check to confirm who you are.", dashReceived: "Requests received", dashSent: "Requests you've sent", dashNoReceived: "No requests yet.", dashNoSent: "You haven't sent any requests yet.", dashViewPublic: "View my public profile" },

  es: { meet: "Conoce a un Compañero", become: "Hazte Compañero",
    heroBadge: "Gente local · Tenerife de verdad", heroA: "Encuentra a tu Compañero para ", heroB: "vivir Tenerife.",
    heroSub: "Un acompañante local para tu día en la isla: calas escondidas, guachinches, acantilados y estrellas. Privado, personal, nada que ver con una excursión en autocar.",
    howTitle: "Tres pasos para un día perfecto en la isla", howSub: "Sencillo, seguro y pensado en torno a personas reales.",
    s1t: "Conoce a tu Compañero", s1d: "Explora a los locales y los días que les encanta compartir. Todos son locales verificados.",
    s2t: "Acordad vuestro día", s2d: "Escribe a tu Compañero, dad forma al plan juntos y reserva de forma segura en la app.",
    s3t: "Vividlo juntos", s3d: "Quedáis y exploráis. Después dejas una reseña: eso es lo que mantiene a Compañero auténtico.",
    compTitle: "Conoce a los Compañeros", compSub: "Locales listos para enseñarte su Tenerife.",
    emptyTitle: "Aún no hay Compañeros", emptyDesc: "Sé el primer local en compartir la isla. En cuanto te unas, tu perfil aparecerá aquí.", emptyBtn: "Sé el primer Compañero",
    travPill: "Para viajeros", travTitle: "El día del que hablarás al volver a casa.",
    travBody: "Ni el resort ni la cola del teleférico, sino la tarde en que un local te llevó a un lugar que nunca habrías encontrado, y la isla por fin se sintió tuya.",
    back: "Volver", verified: "Verificado", hasCar: "Tiene coche", loveShare: "Lo que me encanta compartir", reviews: "Reseñas",
    noReviews: "Aún no hay reseñas: sé el primero en salir con {name} y dejar una.",
    goOut: "Sal con {name}", goOutDesc: "Envía una solicitud y acordad el día juntos. Solo pagas cuando ambos confirmáis el plan.",
    sendReq: "Enviar solicitud", secureNote: "Los pagos se retienen de forma segura y se liberan después de tu día.",
    becomePill: "Para locales", becomeTitle: "Comparte el Tenerife que amas.",
    becomeSub: "No necesitas licencia de guía turístico: eres un compañero, no un guía. Elige tus días, escribe tus propios planes y recibe un trato justo por tu tiempo.",
    formAbout: "Cuéntanos sobre ti", fName: "Tu nombre", fArea: "¿En qué parte de la isla estás?", fAbout: "¿Qué te encantaría compartir?",
    fAboutPh: "Playas escondidas, surf, guachinches, observar las estrellas… cuéntalo a tu manera.", fCar: "¿Tienes coche para tus días?", photo: "Foto de perfil", photoCta: "Añadir foto", getAround: "¿Cómo te gusta moverte?", mCar: "En coche", mBike: "En bici", mWalk: "A pie",
    yes: "Sí", no: "No hace falta",
    terms: "Soy mayor de 18 años y acepto las condiciones de anfitrión: Compañero es para compartir experiencias y buena compañía.", submit: "Enviar solicitud",
    welcome: "Bienvenido a bordo, {name}.", welcomeSub: "Tu perfil ya está activo en la página principal. Esto es lo que sigue:",
    n1t: "Una breve videollamada", n1d: "Una charla de 10 minutos para saber que eres de verdad: es lo que hace que se confíe en Compañero.",
    n2t: "Verificación de DNI y autónomo", n2d: "Verificamos tu identidad (mayor de 18) y te ayudamos con el papeleo para facturar legalmente.",
    n3t: "Empieza a ser anfitrión", n3d: "Los viajeros pueden encontrarte, solicitar un día y pagar de forma segura en la app.", seeProfile: "Ver mi perfil",
    reqTitle: "Envía una solicitud a {name}", reqBody: "Podrás escribir a {name}, acordar el día y el plan, y pagar de forma segura cuando ambos confirméis.",
    cancel: "Cancelar", sendRequest: "Enviar solicitud", sentTitle: "¡Solicitud enviada!",
    sentBody: "{name} te responderá pronto. Podéis planear el día juntos en los mensajes.", backHome: "Volver al inicio",
    fTrust: "Confianza y seguridad", fContact: "Contacto", rights: "Locales verificados · Pagos seguros · +18", copyright: "© {year} Compañero · Tenerife, Islas Canarias", login: "Iniciar sesión", signup: "Registrarse", logout: "Cerrar sesión", dashboard: "Panel", email: "Correo", password: "Contraseña", welcomeBack: "Bienvenido de nuevo", createAccount: "Crea tu cuenta", toSignup: "¿Nuevo aquí? Crea una cuenta", toLogin: "¿Ya tienes cuenta? Inicia sesión", pending: "En revisión", loginToContinue: "Inicia sesión para continuar.", dashTitle: "Tu panel", dashHi: "Sesión iniciada como {email}", dashProfile: "Tu perfil de Compañero", dashNoProfile: "Aún no has creado un perfil de Compañero.", dashBecomeCta: "Crea tu perfil", dashSetup: "Configuración", dashStep1: "Perfil creado", dashStep2: "Verifícate", dashStep2sub: "Te invitaremos a una breve videollamada para confirmar tu identidad.", dashReceived: "Solicitudes recibidas", dashSent: "Solicitudes que enviaste", dashNoReceived: "Aún no hay solicitudes.", dashNoSent: "Aún no has enviado solicitudes.", dashViewPublic: "Ver mi perfil público" },

  de: { meet: "Triff einen Compañero", become: "Werde Compañero",
    heroBadge: "Echte Locals · Echtes Teneriffa", heroA: "Finde deinen Compañero, um ", heroB: "Teneriffa zu erleben.",
    heroSub: "Eine einheimische Begleitung für deinen Tag auf der Insel – versteckte Buchten, familiäre Weinschänken, Klippen und Sterne. Privat, persönlich, nichts wie eine Bustour.",
    howTitle: "Drei Schritte zu einem perfekten Inseltag", howSub: "Einfach, sicher und rund um echte Menschen gebaut.",
    s1t: "Triff deinen Compañero", s1d: "Stöbere durch Locals und die Tage, die sie gern teilen. Jeder ist ein verifizierter Einheimischer.",
    s2t: "Plant euren Tag", s2d: "Schreibe deinem Compañero, gestaltet den Plan gemeinsam und buche sicher über die App.",
    s3t: "Erlebt es zusammen", s3d: "Ihr trefft euch und entdeckt die Insel. Danach hinterlässt du eine Bewertung – das hält Compañero echt.",
    compTitle: "Triff die Compañeros", compSub: "Locals, die dir ihr Teneriffa zeigen wollen.",
    emptyTitle: "Noch keine Compañeros", emptyDesc: "Sei der erste Local, der die Insel teilt. Sobald du dabei bist, erscheint dein Profil genau hier.", emptyBtn: "Werde der erste Compañero",
    travPill: "Für Reisende", travTitle: "Der Tag, von dem du zu Hause erzählen wirst.",
    travBody: "Nicht das Resort, nicht die Schlange an der Seilbahn – sondern der Nachmittag, an dem dich ein Local an einen Ort brachte, den du nie gefunden hättest, und sich die Insel endlich nach dir anfühlte.",
    back: "Zurück", verified: "Verifiziert", hasCar: "Hat ein Auto", loveShare: "Was ich gern teile", reviews: "Bewertungen",
    noReviews: "Noch keine Bewertungen – sei der Erste, der mit {name} unterwegs ist und eine hinterlässt.",
    goOut: "Geh mit {name} los", goOutDesc: "Sende eine Anfrage und stimmt den Tag gemeinsam ab. Du zahlst erst, wenn ihr beide den Plan bestätigt.",
    sendReq: "Anfrage senden", secureNote: "Zahlungen werden sicher verwahrt und nach deinem Tag freigegeben.",
    becomePill: "Für Locals", becomeTitle: "Teile das Teneriffa, das du liebst.",
    becomeSub: "Du brauchst keine Reiseleiterlizenz – du bist ein Begleiter, kein Guide. Wähle deine Tage, schreibe deine eigenen Pläne und werde fair für deine Zeit entlohnt.",
    formAbout: "Erzähl uns von dir", fName: "Dein Name", fArea: "Wo auf der Insel bist du?", fAbout: "Was würdest du gern teilen?",
    fAboutPh: "Versteckte Strände, Surfen, Guachinches, Sterne beobachten … schreib es in deinen Worten.", fCar: "Hast du ein Auto für deine Tage?", photo: "Profilfoto", photoCta: "Foto hinzufügen", getAround: "Wie bist du gern unterwegs?", mCar: "Mit dem Auto", mBike: "Mit dem Rad", mWalk: "Zu Fuß",
    yes: "Ja", no: "Nicht nötig",
    terms: "Ich bin 18 oder älter und akzeptiere die Gastgeber-Bedingungen – bei Compañero geht es um geteilte Erlebnisse und gute Gesellschaft.", submit: "Bewerbung absenden",
    welcome: "Willkommen an Bord, {name}.", welcomeSub: "Dein Profil ist auf der Startseite live. So geht es weiter:",
    n1t: "Ein kurzer Videoanruf", n1d: "Ein 10-minütiges Gespräch, damit wir wissen, dass du echt bist – das macht Compañero vertrauenswürdig.",
    n2t: "Ausweis- & Autónomo-Prüfung", n2d: "Wir prüfen deinen Ausweis (18+) und helfen dir mit dem Papierkram, um legal abzurechnen.",
    n3t: "Leg als Gastgeber los", n3d: "Reisende können dich finden, einen Tag anfragen und sicher über die App bezahlen.", seeProfile: "Mein Profil ansehen",
    reqTitle: "Sende {name} eine Anfrage", reqBody: "Du kannst {name} schreiben, den Tag und Plan abstimmen und sicher bezahlen, sobald ihr beide bestätigt.",
    cancel: "Abbrechen", sendRequest: "Anfrage senden", sentTitle: "Anfrage gesendet!",
    sentBody: "{name} meldet sich bald bei dir. Den Tag könnt ihr gemeinsam in den Nachrichten planen.", backHome: "Zur Startseite",
    fTrust: "Vertrauen & Sicherheit", fContact: "Kontakt", rights: "Verifizierte Locals · Sichere Zahlungen · 18+", copyright: "© {year} Compañero · Teneriffa, Kanarische Inseln", login: "Anmelden", signup: "Registrieren", logout: "Abmelden", dashboard: "Dashboard", email: "E-Mail", password: "Passwort", welcomeBack: "Willkommen zurück", createAccount: "Konto erstellen", toSignup: "Neu hier? Konto erstellen", toLogin: "Schon ein Konto? Anmelden", pending: "In Prüfung", loginToContinue: "Bitte melde dich an, um fortzufahren.", dashTitle: "Dein Dashboard", dashHi: "Angemeldet als {email}", dashProfile: "Dein Compañero-Profil", dashNoProfile: "Du hast noch kein Compañero-Profil erstellt.", dashBecomeCta: "Profil erstellen", dashSetup: "Einrichtung", dashStep1: "Profil erstellt", dashStep2: "Verifizieren", dashStep2sub: "Wir laden dich zu einem kurzen Videocheck ein, um deine Identität zu bestätigen.", dashReceived: "Erhaltene Anfragen", dashSent: "Gesendete Anfragen", dashNoReceived: "Noch keine Anfragen.", dashNoSent: "Du hast noch keine Anfragen gesendet.", dashViewPublic: "Mein öffentliches Profil ansehen" },

  fr: { meet: "Rencontrez un Compañero", become: "Devenez Compañero",
    heroBadge: "De vrais locaux · La vraie Tenerife", heroA: "Trouvez votre Compañero pour ", heroB: "vivre Tenerife.",
    heroSub: "Un compagnon local pour votre journée sur l'île : criques cachées, guachinches familiales, falaises et étoiles. Privé, personnel, rien à voir avec un tour en autocar.",
    howTitle: "Trois étapes vers une journée parfaite sur l'île", howSub: "Simple, sûr et pensé autour de vraies personnes.",
    s1t: "Rencontrez votre Compañero", s1d: "Parcourez les locaux et les journées qu'ils aiment partager. Chacun est un local vérifié.",
    s2t: "Décidez de votre journée", s2d: "Écrivez à votre Compañero, construisez le plan ensemble et réservez en toute sécurité dans l'app.",
    s3t: "Vivez-la ensemble", s3d: "Vous vous retrouvez et explorez. Ensuite, vous laissez un avis : c'est ce qui garde Compañero authentique.",
    compTitle: "Rencontrez les Compañeros", compSub: "Des locaux prêts à vous montrer leur Tenerife.",
    emptyTitle: "Pas encore de Compañeros", emptyDesc: "Soyez le premier local à partager l'île. Dès que vous nous rejoignez, votre profil apparaît ici.", emptyBtn: "Soyez le premier Compañero",
    travPill: "Pour les voyageurs", travTitle: "La journée dont vous parlerez en rentrant.",
    travBody: "Ni le complexe hôtelier, ni la file du téléphérique, mais l'après-midi où un local vous a emmené là où vous n'auriez jamais trouvé, et où l'île est enfin devenue la vôtre.",
    back: "Retour", verified: "Vérifié", hasCar: "A une voiture", loveShare: "Ce que j'aime partager", reviews: "Avis",
    noReviews: "Pas encore d'avis : soyez le premier à sortir avec {name} et à en laisser un.",
    goOut: "Sortez avec {name}", goOutDesc: "Envoyez une demande et convenez de la journée ensemble. Vous ne payez qu'une fois le plan confirmé par tous les deux.",
    sendReq: "Envoyer une demande", secureNote: "Les paiements sont conservés en sécurité et versés après votre journée.",
    becomePill: "Pour les locaux", becomeTitle: "Partagez la Tenerife que vous aimez.",
    becomeSub: "Pas besoin de licence de guide : vous êtes un compagnon, pas un guide. Choisissez vos jours, écrivez vos propres plans et soyez justement rémunéré pour votre temps.",
    formAbout: "Parlez-nous de vous", fName: "Votre nom", fArea: "Où êtes-vous sur l'île ?", fAbout: "Qu'aimeriez-vous partager ?",
    fAboutPh: "Plages cachées, surf, guachinches, observation des étoiles… racontez-le à votre façon.", fCar: "Avez-vous une voiture pour vos journées ?", photo: "Photo de profil", photoCta: "Ajouter une photo", getAround: "Comment aimez-vous vous déplacer ?", mCar: "En voiture", mBike: "À vélo", mWalk: "À pied",
    yes: "Oui", no: "Pas nécessaire",
    terms: "J'ai 18 ans ou plus et j'accepte les conditions d'hôte : Compañero, c'est pour partager des expériences et de la bonne compagnie.", submit: "Envoyer la candidature",
    welcome: "Bienvenue à bord, {name}.", welcomeSub: "Votre profil est en ligne sur la page d'accueil. Voici la suite :",
    n1t: "Un court appel vidéo", n1d: "Un échange de 10 minutes pour savoir que vous êtes bien réel : c'est ce qui rend Compañero fiable.",
    n2t: "Vérification d'identité & autónomo", n2d: "Nous vérifions votre identité (18+) et vous aidons avec les démarches pour facturer légalement.",
    n3t: "Commencez à accueillir", n3d: "Les voyageurs peuvent vous trouver, demander une journée et payer en toute sécurité dans l'app.", seeProfile: "Voir mon profil",
    reqTitle: "Envoyez une demande à {name}", reqBody: "Vous pourrez écrire à {name}, convenir de la journée et du plan, et payer en toute sécurité une fois que vous aurez tous les deux confirmé.",
    cancel: "Annuler", sendRequest: "Envoyer la demande", sentTitle: "Demande envoyée !",
    sentBody: "{name} vous répondra bientôt. Vous pouvez planifier la journée ensemble dans vos messages.", backHome: "Retour à l'accueil",
    fTrust: "Confiance et sécurité", fContact: "Contact", rights: "Locaux vérifiés · Paiements sécurisés · 18+", copyright: "© {year} Compañero · Tenerife, Îles Canaries", login: "Se connecter", signup: "S'inscrire", logout: "Se déconnecter", dashboard: "Tableau de bord", email: "E-mail", password: "Mot de passe", welcomeBack: "Bon retour", createAccount: "Créez votre compte", toSignup: "Nouveau ici ? Créez un compte", toLogin: "Déjà un compte ? Connectez-vous", pending: "En cours de vérification", loginToContinue: "Connectez-vous pour continuer.", dashTitle: "Votre tableau de bord", dashHi: "Connecté en tant que {email}", dashProfile: "Votre profil de Compañero", dashNoProfile: "Vous n'avez pas encore créé de profil de Compañero.", dashBecomeCta: "Créer mon profil", dashSetup: "Configuration", dashStep1: "Profil créé", dashStep2: "Se faire vérifier", dashStep2sub: "Nous vous inviterons à un court appel vidéo pour confirmer votre identité.", dashReceived: "Demandes reçues", dashSent: "Demandes envoyées", dashNoReceived: "Aucune demande pour l'instant.", dashNoSent: "Vous n'avez encore envoyé aucune demande.", dashViewPublic: "Voir mon profil public" },

  it: { meet: "Incontra un Compañero", become: "Diventa Compañero",
    heroBadge: "Gente del posto · La vera Tenerife", heroA: "Trova il tuo Compañero per ", heroB: "vivere Tenerife.",
    heroSub: "Un compagno locale per la tua giornata sull'isola: cale nascoste, guachinche di famiglia, scogliere e stelle. Privato, personale, niente a che vedere con una gita in pullman.",
    howTitle: "Tre passi per una giornata perfetta sull'isola", howSub: "Semplice, sicuro e costruito attorno a persone vere.",
    s1t: "Incontra il tuo Compañero", s1d: "Scopri i locali e le giornate che amano condividere. Ognuno è un local verificato.",
    s2t: "Accordatevi sulla giornata", s2d: "Scrivi al tuo Compañero, costruite insieme il piano e prenota in sicurezza nell'app.",
    s3t: "Vivetela insieme", s3d: "Vi incontrate ed esplorate. Poi lasci una recensione: è ciò che mantiene Compañero autentico.",
    compTitle: "Incontra i Compañeros", compSub: "Gente del posto pronta a mostrarti la sua Tenerife.",
    emptyTitle: "Ancora nessun Compañero", emptyDesc: "Sii il primo local a condividere l'isola. Appena ti unisci, il tuo profilo appare proprio qui.", emptyBtn: "Diventa il primo Compañero",
    travPill: "Per i viaggiatori", travTitle: "La giornata di cui parlerai una volta tornato a casa.",
    travBody: "Non il resort, non la fila per la funivia, ma il pomeriggio in cui un local ti ha portato dove non avresti mai trovato, e l'isola è finalmente sembrata tua.",
    back: "Indietro", verified: "Verificato", hasCar: "Ha l'auto", loveShare: "Ciò che amo condividere", reviews: "Recensioni",
    noReviews: "Ancora nessuna recensione: sii il primo a uscire con {name} e a lasciarne una.",
    goOut: "Esci con {name}", goOutDesc: "Invia una richiesta e accordatevi sulla giornata insieme. Paghi solo quando entrambi confermate il piano.",
    sendReq: "Invia una richiesta", secureNote: "I pagamenti sono custoditi in sicurezza e rilasciati dopo la tua giornata.",
    becomePill: "Per i local", becomeTitle: "Condividi la Tenerife che ami.",
    becomeSub: "Non ti serve una licenza da guida turistica: sei un compagno, non una guida. Scegli le tue giornate, scrivi i tuoi piani e ricevi un compenso equo per il tuo tempo.",
    formAbout: "Parlaci di te", fName: "Il tuo nome", fArea: "In quale parte dell'isola ti trovi?", fAbout: "Cosa ti piacerebbe condividere?",
    fAboutPh: "Spiagge nascoste, surf, guachinche, osservare le stelle… raccontalo a modo tuo.", fCar: "Hai un'auto per le tue giornate?", photo: "Foto profilo", photoCta: "Aggiungi foto", getAround: "Come ti piace spostarti?", mCar: "In auto", mBike: "In bici", mWalk: "A piedi",
    yes: "Sì", no: "Non serve",
    terms: "Ho almeno 18 anni e accetto le condizioni per gli host: Compañero serve a condividere esperienze e buona compagnia.", submit: "Invia candidatura",
    welcome: "Benvenuto a bordo, {name}.", welcomeSub: "Il tuo profilo è online sulla home page. Ecco i prossimi passi:",
    n1t: "Una breve videochiamata", n1d: "Una chiacchierata di 10 minuti per sapere che sei una persona vera: è ciò che rende Compañero affidabile.",
    n2t: "Verifica documento e autónomo", n2d: "Verifichiamo la tua identità (18+) e ti aiutiamo con le pratiche per fatturare legalmente.",
    n3t: "Inizia a ospitare", n3d: "I viaggiatori possono trovarti, richiedere una giornata e pagare in sicurezza nell'app.", seeProfile: "Vedi il mio profilo",
    reqTitle: "Invia una richiesta a {name}", reqBody: "Potrai scrivere a {name}, accordarti sulla giornata e sul piano e pagare in sicurezza una volta che entrambi confermate.",
    cancel: "Annulla", sendRequest: "Invia richiesta", sentTitle: "Richiesta inviata!",
    sentBody: "{name} ti risponderà presto. Potete pianificare la giornata insieme nei messaggi.", backHome: "Torna alla home",
    fTrust: "Fiducia e sicurezza", fContact: "Contatti", rights: "Local verificati · Pagamenti sicuri · 18+", copyright: "© {year} Compañero · Tenerife, Isole Canarie", login: "Accedi", signup: "Registrati", logout: "Esci", dashboard: "Dashboard", email: "Email", password: "Password", welcomeBack: "Bentornato", createAccount: "Crea il tuo account", toSignup: "Nuovo qui? Crea un account", toLogin: "Hai già un account? Accedi", pending: "In revisione", loginToContinue: "Accedi per continuare.", dashTitle: "La tua dashboard", dashHi: "Accesso come {email}", dashProfile: "Il tuo profilo Compañero", dashNoProfile: "Non hai ancora creato un profilo Compañero.", dashBecomeCta: "Crea il tuo profilo", dashSetup: "Configurazione", dashStep1: "Profilo creato", dashStep2: "Verìficati", dashStep2sub: "Ti inviteremo a una breve videochiamata per confermare la tua identità.", dashReceived: "Richieste ricevute", dashSent: "Richieste inviate", dashNoReceived: "Ancora nessuna richiesta.", dashNoSent: "Non hai ancora inviato richieste.", dashViewPublic: "Vedi il mio profilo pubblico" },

  ro: { meet: "Cunoaște un Compañero", become: "Devino Compañero",
    heroBadge: "Localnici reali · Tenerife real", heroA: "Găsește-ți Compañero ca să ", heroB: "trăiești Tenerife.",
    heroSub: "Un companion local pentru ziua ta pe insulă — golfuri ascunse, guachinches de familie, faleze și stele. Privat, personal, nimic ca o excursie cu autocarul.",
    howTitle: "Trei pași spre o zi perfectă pe insulă", howSub: "Simplu, sigur și construit în jurul oamenilor reali.",
    s1t: "Cunoaște-ți Compañero", s1d: "Răsfoiește localnicii și zilele pe care le împărtășesc cu drag. Fiecare e un localnic verificat.",
    s2t: "Stabiliți ziua împreună", s2d: "Scrie-i Compañero-ului tău, conturați planul împreună și rezervă în siguranță din aplicație.",
    s3t: "Trăiți-o împreună", s3d: "Vă întâlniți și explorați. După aceea lași o recenzie — asta ține Compañero autentic.",
    compTitle: "Cunoaște Compañeros", compSub: "Localnici gata să-ți arate Tenerife-ul lor.",
    emptyTitle: "Încă niciun Compañero", emptyDesc: "Fii primul localnic care împărtășește insula. De cum te alături, profilul tău apare chiar aici.", emptyBtn: "Devino primul Compañero",
    travPill: "Pentru călători", travTitle: "Ziua despre care vei povesti când ajungi acasă.",
    travBody: "Nu resortul, nu coada la telecabină — ci după-amiaza în care un localnic te-a dus undeva unde nu ai fi ajuns niciodată, iar insula a devenit în sfârșit a ta.",
    back: "Înapoi", verified: "Verificat", hasCar: "Are mașină", loveShare: "Ce îmi place să împărtășesc", reviews: "Recenzii",
    noReviews: "Încă nicio recenzie — fii primul care iese cu {name} și lasă una.",
    goOut: "Ieși cu {name}", goOutDesc: "Trimite o cerere și stabiliți ziua împreună. Plătești doar după ce confirmați amândoi planul.",
    sendReq: "Trimite o cerere", secureNote: "Plățile sunt păstrate în siguranță și eliberate după ziua ta.",
    becomePill: "Pentru localnici", becomeTitle: "Împărtășește Tenerife-ul pe care îl iubești.",
    becomeSub: "Nu ai nevoie de licență de ghid turistic — ești un companion, nu un ghid. Alege-ți zilele, scrie-ți propriile planuri și fii apreciat corect pentru timpul tău.",
    formAbout: "Spune-ne despre tine", fName: "Numele tău", fArea: "În ce parte a insulei ești?", fAbout: "Ce ți-ar plăcea să împărtășești?",
    fAboutPh: "Plaje ascunse, surf, guachinches, privit stelele… spune-o în felul tău.", fCar: "Ai mașină pentru zilele tale?", photo: "Poză de profil", photoCta: "Adaugă o poză", getAround: "Cum îți place să te deplasezi?", mCar: "Cu mașina", mBike: "Cu bicicleta", mWalk: "Pe jos",
    yes: "Da", no: "Nu e nevoie",
    terms: "Am 18 ani sau mai mult și accept condițiile pentru gazde — Compañero e pentru a împărtăși experiențe și companie plăcută.", submit: "Trimite aplicația",
    welcome: "Bun venit, {name}.", welcomeSub: "Profilul tău e activ pe pagina principală. Iată ce urmează:",
    n1t: "Un scurt apel video", n1d: "O discuție de 10 minute ca să știm că ești real — asta menține încrederea în Compañero.",
    n2t: "Verificare act & autónomo", n2d: "Îți verificăm identitatea (18+) și te ajutăm cu actele ca să facturezi legal.",
    n3t: "Începe să fii gazdă", n3d: "Călătorii te pot găsi, pot cere o zi și pot plăti în siguranță din aplicație.", seeProfile: "Vezi profilul meu",
    reqTitle: "Trimite o cerere către {name}", reqBody: "Vei putea să-i scrii lui {name}, să stabiliți ziua și planul și să plătești în siguranță după ce confirmați amândoi.",
    cancel: "Anulează", sendRequest: "Trimite cererea", sentTitle: "Cerere trimisă!",
    sentBody: "{name} îți va răspunde în curând. Puteți planifica ziua împreună în mesaje.", backHome: "Înapoi acasă",
    fTrust: "Încredere și siguranță", fContact: "Contact", rights: "Localnici verificați · Plăți sigure · 18+", copyright: "© {year} Compañero · Tenerife, Insulele Canare", login: "Autentificare", signup: "Înregistrare", logout: "Deconectare", dashboard: "Panou", email: "Email", password: "Parolă", welcomeBack: "Bine ai revenit", createAccount: "Creează-ți contul", toSignup: "Ești nou? Creează un cont", toLogin: "Ai deja cont? Autentifică-te", pending: "În verificare", loginToContinue: "Autentifică-te pentru a continua.", dashTitle: "Panoul tău", dashHi: "Conectat ca {email}", dashProfile: "Profilul tău de Compañero", dashNoProfile: "Încă nu ai creat un profil de Compañero.", dashBecomeCta: "Creează-ți profilul", dashSetup: "Configurare", dashStep1: "Profil creat", dashStep2: "Verifică-te", dashStep2sub: "Te vom invita la un scurt apel video ca să-ți confirmăm identitatea.", dashReceived: "Cereri primite", dashSent: "Cereri trimise", dashNoReceived: "Încă nicio cerere.", dashNoSent: "Încă nu ai trimis nicio cerere.", dashViewPublic: "Vezi profilul meu public" },

  ru: { meet: "Найти Compañero", become: "Стать Compañero",
    heroBadge: "Настоящие местные · Настоящий Тенерифе", heroA: "Найдите своего Compañero, чтобы ", heroB: "почувствовать Тенерифе.",
    heroSub: "Местный спутник на ваш день на острове — укромные бухты, семейные гуачинче, скалы и звёзды. Лично, по-настоящему, совсем не как автобусная экскурсия.",
    howTitle: "Три шага к идеальному дню на острове", howSub: "Просто, безопасно и построено вокруг настоящих людей.",
    s1t: "Найдите своего Compañero", s1d: "Просматривайте местных и дни, которыми они любят делиться. Каждый — проверенный местный житель.",
    s2t: "Договоритесь о дне", s2d: "Напишите своему Compañero, вместе продумайте план и забронируйте безопасно в приложении.",
    s3t: "Проживите его вместе", s3d: "Вы встречаетесь и исследуете остров. Потом вы оставляете отзыв — именно это делает Compañero настоящим.",
    compTitle: "Знакомьтесь с Compañeros", compSub: "Местные, готовые показать вам свой Тенерифе.",
    emptyTitle: "Пока нет ни одного Compañero", emptyDesc: "Станьте первым местным, кто поделится островом. Как только вы присоединитесь, ваш профиль появится здесь.", emptyBtn: "Стать первым Compañero",
    travPill: "Для путешественников", travTitle: "День, о котором вы будете рассказывать дома.",
    travBody: "Не отель и не очередь на канатную дорогу, а тот день, когда местный отвёл вас туда, куда вы сами никогда бы не попали, и остров наконец стал вашим.",
    back: "Назад", verified: "Проверен", hasCar: "Есть машина", loveShare: "Чем я люблю делиться", reviews: "Отзывы",
    noReviews: "Отзывов пока нет — станьте первым, кто проведёт день с {name}, и оставьте отзыв.",
    goOut: "Провести день с {name}", goOutDesc: "Отправьте запрос и договоритесь о дне вместе. Вы платите только после того, как оба подтвердите план.",
    sendReq: "Отправить запрос", secureNote: "Платежи надёжно удерживаются и переводятся после вашего дня.",
    becomePill: "Для местных", becomeTitle: "Поделитесь Тенерифе, который вы любите.",
    becomeSub: "Лицензия гида не нужна — вы спутник, а не гид. Выбирайте свои дни, пишите свои планы и получайте справедливую оплату за своё время.",
    formAbout: "Расскажите о себе", fName: "Ваше имя", fArea: "В какой части острова вы находитесь?", fAbout: "Чем вы хотели бы поделиться?",
    fAboutPh: "Скрытые пляжи, сёрфинг, гуачинче, наблюдение за звёздами… расскажите своими словами.", fCar: "Есть ли у вас машина для ваших дней?", photo: "Фото профиля", photoCta: "Добавить фото", getAround: "Как вам нравится передвигаться?", mCar: "На машине", mBike: "На велосипеде", mWalk: "Пешком",
    yes: "Да", no: "Не нужна",
    terms: "Мне 18 лет или больше, и я принимаю условия для хозяев — Compañero создан для того, чтобы делиться впечатлениями и хорошей компанией.", submit: "Отправить заявку",
    welcome: "Добро пожаловать, {name}!", welcomeSub: "Ваш профиль уже на главной странице. Вот что дальше:",
    n1t: "Короткий видеозвонок", n1d: "10-минутный разговор, чтобы убедиться, что вы настоящий — это поддерживает доверие к Compañero.",
    n2t: "Проверка документа и autónomo", n2d: "Мы проверяем вашу личность (18+) и помогаем с документами, чтобы выставлять счета легально.",
    n3t: "Начните принимать гостей", n3d: "Путешественники смогут найти вас, запросить день и безопасно оплатить в приложении.", seeProfile: "Посмотреть мой профиль",
    reqTitle: "Отправить запрос {name}", reqBody: "Вы сможете написать {name}, договориться о дне и плане и безопасно оплатить, когда оба подтвердите.",
    cancel: "Отмена", sendRequest: "Отправить запрос", sentTitle: "Запрос отправлен!",
    sentBody: "{name} скоро вам ответит. Вы можете спланировать день вместе в сообщениях.", backHome: "На главную",
    fTrust: "Доверие и безопасность", fContact: "Контакты", rights: "Проверенные местные · Безопасные платежи · 18+", copyright: "© {year} Compañero · Тенерифе, Канарские острова", login: "Войти", signup: "Регистрация", logout: "Выйти", dashboard: "Панель", email: "Эл. почта", password: "Пароль", welcomeBack: "С возвращением", createAccount: "Создайте аккаунт", toSignup: "Впервые здесь? Создайте аккаунт", toLogin: "Уже есть аккаунт? Войдите", pending: "На проверке", loginToContinue: "Войдите, чтобы продолжить.", dashTitle: "Ваша панель", dashHi: "Вы вошли как {email}", dashProfile: "Ваш профиль Compañero", dashNoProfile: "Вы ещё не создали профиль Compañero.", dashBecomeCta: "Создать профиль", dashSetup: "Настройка", dashStep1: "Профиль создан", dashStep2: "Пройти проверку", dashStep2sub: "Мы пригласим вас на короткий видеозвонок для подтверждения личности.", dashReceived: "Полученные запросы", dashSent: "Отправленные запросы", dashNoReceived: "Запросов пока нет.", dashNoSent: "Вы ещё не отправляли запросов.", dashViewPublic: "Посмотреть мой публичный профиль" },

  uk: { meet: "Знайти Compañero", become: "Стати Compañero",
    heroBadge: "Справжні місцеві · Справжній Тенерифе", heroA: "Знайдіть свого Compañero, щоб ", heroB: "відчути Тенерифе.",
    heroSub: "Місцевий супутник на ваш день на острові — приховані бухти, сімейні ґуачинче, скелі та зорі. Особисто, по-справжньому, зовсім не як автобусна екскурсія.",
    howTitle: "Три кроки до ідеального дня на острові", howSub: "Просто, безпечно й побудовано навколо справжніх людей.",
    s1t: "Знайдіть свого Compañero", s1d: "Переглядайте місцевих і дні, якими вони люблять ділитися. Кожен — перевірений місцевий житель.",
    s2t: "Домовтеся про день", s2d: "Напишіть своєму Compañero, разом сплануйте день і забронюйте безпечно в застосунку.",
    s3t: "Проживіть його разом", s3d: "Ви зустрічаєтеся й досліджуєте острів. Потім ви залишаєте відгук — саме це робить Compañero справжнім.",
    compTitle: "Знайомтеся з Compañeros", compSub: "Місцеві, готові показати вам свій Тенерифе.",
    emptyTitle: "Поки що немає жодного Compañero", emptyDesc: "Станьте першим місцевим, хто поділиться островом. Щойно ви приєднаєтеся, ваш профіль з'явиться тут.", emptyBtn: "Стати першим Compañero",
    travPill: "Для мандрівників", travTitle: "День, про який ви розповідатимете вдома.",
    travBody: "Не курорт і не черга на канатну дорогу, а той день, коли місцевий привів вас туди, куди ви самі ніколи б не потрапили, і острів нарешті став вашим.",
    back: "Назад", verified: "Перевірено", hasCar: "Має авто", loveShare: "Чим я люблю ділитися", reviews: "Відгуки",
    noReviews: "Відгуків поки немає — станьте першим, хто проведе день із {name}, і залиште відгук.",
    goOut: "Провести день із {name}", goOutDesc: "Надішліть запит і домовтеся про день разом. Ви платите лише після того, як обидва підтвердите план.",
    sendReq: "Надіслати запит", secureNote: "Платежі надійно зберігаються й переказуються після вашого дня.",
    becomePill: "Для місцевих", becomeTitle: "Поділіться Тенерифе, який ви любите.",
    becomeSub: "Ліцензія гіда не потрібна — ви супутник, а не гід. Обирайте свої дні, пишіть власні плани й отримуйте справедливу оплату за свій час.",
    formAbout: "Розкажіть про себе", fName: "Ваше ім'я", fArea: "У якій частині острова ви перебуваєте?", fAbout: "Чим би ви хотіли поділитися?",
    fAboutPh: "Приховані пляжі, серфінг, ґуачинче, спостереження за зорями… розкажіть своїми словами.", fCar: "Чи маєте ви авто для своїх днів?", photo: "Фото профілю", photoCta: "Додати фото", getAround: "Як вам подобається пересуватися?", mCar: "Автомобілем", mBike: "Велосипедом", mWalk: "Пішки",
    yes: "Так", no: "Не потрібно",
    terms: "Мені 18 років або більше, і я приймаю умови для господарів — Compañero створений, щоб ділитися враженнями та гарною компанією.", submit: "Надіслати заявку",
    welcome: "Ласкаво просимо, {name}!", welcomeSub: "Ваш профіль уже на головній сторінці. Ось що далі:",
    n1t: "Короткий відеодзвінок", n1d: "10-хвилинна розмова, щоб переконатися, що ви справжні — це підтримує довіру до Compañero.",
    n2t: "Перевірка документа й autónomo", n2d: "Ми перевіряємо вашу особу (18+) і допомагаємо з документами, щоб виставляти рахунки легально.",
    n3t: "Почніть приймати гостей", n3d: "Мандрівники зможуть знайти вас, запросити день і безпечно сплатити в застосунку.", seeProfile: "Переглянути мій профіль",
    reqTitle: "Надіслати запит до {name}", reqBody: "Ви зможете написати {name}, домовитися про день і план та безпечно сплатити, коли обидва підтвердите.",
    cancel: "Скасувати", sendRequest: "Надіслати запит", sentTitle: "Запит надіслано!",
    sentBody: "{name} незабаром вам відповість. Ви можете спланувати день разом у повідомленнях.", backHome: "На головну",
    fTrust: "Довіра і безпека", fContact: "Контакти", rights: "Перевірені місцеві · Безпечні платежі · 18+", copyright: "© {year} Compañero · Тенерифе, Канарські острови", login: "Увійти", signup: "Реєстрація", logout: "Вийти", dashboard: "Панель", email: "Ел. пошта", password: "Пароль", welcomeBack: "З поверненням", createAccount: "Створіть акаунт", toSignup: "Уперше тут? Створіть акаунт", toLogin: "Вже маєте акаунт? Увійдіть", pending: "На перевірці", loginToContinue: "Увійдіть, щоб продовжити.", dashTitle: "Ваша панель", dashHi: "Ви увійшли як {email}", dashProfile: "Ваш профіль Compañero", dashNoProfile: "Ви ще не створили профіль Compañero.", dashBecomeCta: "Створити профіль", dashSetup: "Налаштування", dashStep1: "Профіль створено", dashStep2: "Пройти перевірку", dashStep2sub: "Ми запросимо вас на короткий відеодзвінок для підтвердження особи.", dashReceived: "Отримані запити", dashSent: "Надіслані запити", dashNoReceived: "Запитів поки немає.", dashNoSent: "Ви ще не надсилали запитів.", dashViewPublic: "Переглянути мій публічний профіль" },
};
const fill = (s, vars = {}) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
const mapRow = (r) => ({ id: r.id, name: r.name, area: r.area, about: r.about, modes: r.modes || [], photo: r.photo_url, status: r.status || "pending", user_id: r.user_id });

/* ============================== UI ATOMS ============================== */
const Pill = ({ children, style }) => (<span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.3, padding: "5px 11px", borderRadius: 999, ...style }}>{children}</span>);
function Btn({ children, onClick, kind = "primary", style }) {
  const base = { fontFamily: BODY, fontWeight: 600, fontSize: 15, border: "none", borderRadius: 999, padding: "12px 22px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform .15s, box-shadow .2s, background .2s, opacity .2s" };
  const kinds = { primary: { background: C.coral, color: "#FFF", boxShadow: "0 10px 24px -10px rgba(241,91,69,.6)" }, dark: { background: C.ink, color: "#FFF" }, ghost: { background: C.surface, color: C.ink, border: `1px solid ${C.line}` } };
  return (<button onClick={onClick} style={{ ...base, ...kinds[kind], ...style }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>{children}</button>);
}
function Avatar({ name, i = 0, size = 40, photo }) {
  const t = tintFor(i);
  if (photo) return (<img src={photo} alt="" style={{ width: size, height: size, borderRadius: 999, flexShrink: 0, objectFit: "cover", border: `1px solid ${C.line}` }} />);
  return (<div style={{ width: size, height: size, borderRadius: 999, flexShrink: 0, background: t.tint, border: `1px solid ${C.line}`, color: t.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: size * 0.4 }}>{name[0]?.toUpperCase()}</div>);
}

/* ============================== LANGUAGE MENU ============================== */
function LangMenu({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: BODY, fontSize: 14, color: C.inkSoft, padding: "8px 8px" }}><Globe size={16} /> {lang.toUpperCase()}</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 59 }} />
          <div style={{ position: "absolute", right: 0, top: "115%", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, boxShadow: C.shadowHi, padding: 6, zIndex: 60, minWidth: 168 }}>
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} style={{ width: "100%", textAlign: "left", background: l.code === lang ? C.lineSoft : "none", border: "none", cursor: "pointer", fontFamily: BODY, fontSize: 14.5, fontWeight: l.code === lang ? 700 : 500, color: C.ink, padding: "10px 12px", borderRadius: 9 }}>{l.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============================== COMPANION VISUAL + CARD ============================== */
function CompanionMark({ name, i, size = 64, h = 200, photo }) {
  const t = tintFor(i);
  return (
    <div style={{ position: "relative", height: h, width: "100%", borderRadius: 16, overflow: "hidden", background: `linear-gradient(160deg, ${t.tint}, #FFFFFF 130%)`, border: `1px solid ${C.line}` }}>
      <div className="cm-shimmer" style={{ position: "absolute", top: 0, bottom: 0, width: "55%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,.7), transparent)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <span className="cm-floaty" style={{ width: size, height: size, borderRadius: 999, overflow: "hidden", background: C.surface, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.ink, fontFamily: HEAD, fontWeight: 700, fontSize: size * 0.42, boxShadow: "0 8px 20px -12px rgba(33,37,31,.3)" }}>{photo ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : name[0]?.toUpperCase()}</span>
        <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4, color: t.ink, textTransform: "uppercase", opacity: 0.85 }}>Compañero</span>
      </div>
    </div>
  );
}
function CompanionCard({ comp, i, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={() => onOpen(comp)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer", animation: `fadeUp .55s ${i * 0.05}s both`, transform: hover ? "translateY(-4px)" : "none", transition: "transform .25s cubic-bezier(.2,.7,.2,1)" }}>
      <CompanionMark name={comp.name} i={i} h={208} photo={comp.photo} />
      <div style={{ padding: "13px 2px 0" }}>
        <h3 style={{ fontFamily: HEAD, fontSize: 18, fontWeight: 600, color: C.ink, margin: 0 }}>{comp.name}</h3>
        <p style={{ fontFamily: BODY, fontSize: 13.5, color: C.inkSoft, margin: "4px 0 0", display: "inline-flex", alignItems: "center", gap: 5 }}><MapPin size={14} color={C.coral} /> {comp.area}</p>
        <p style={{ fontFamily: BODY, fontSize: 14, color: C.inkSoft, margin: "8px 0 0", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{comp.about}</p>
      </div>
    </div>
  );
}

/* ============================== NAV ============================== */
function Nav({ go, solid, t, lang, setLang, user, onLogin, onLogout, onDashboard }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(252,251,248,.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${solid ? C.line : "transparent"}`, transition: "border-color .3s" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "13px 20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => { setOpen(false); go("home"); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: C.coral, display: "flex", alignItems: "center", justifyContent: "center" }}><Compass size={18} color="#FFF" /></span>
          <span style={{ fontFamily: HEAD, fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: -0.4 }}>Compañero</span>
        </button>
        <div className="cm-desk" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => go("home", { scroll: "companeros" })} style={navLink}>{t.meet}</button>
          <button onClick={() => go("become")} style={navLink}>{t.become}</button>
          {user
            ? <><button onClick={onDashboard} style={navLink}>{t.dashboard}</button><button onClick={onLogout} style={navLink}>{t.logout}</button></>
            : <button onClick={onLogin} style={navLink}>{t.login}</button>}
          <LangMenu lang={lang} setLang={setLang} />
        </div>
        <button className="cm-mob" onClick={() => setOpen(!open)} aria-label="Menu" style={{ marginLeft: "auto", width: 42, height: 42, borderRadius: 12, border: `1px solid ${C.line}`, background: C.surface, cursor: "pointer", color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <div className="cm-mob" style={{ padding: "6px 16px 18px", animation: "fadeIn .2s both" }}>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 8, boxShadow: C.shadow }}>
            <button onClick={() => { setOpen(false); go("home", { scroll: "companeros" }); }} style={mobItem}>{t.meet}</button>
            <div style={{ height: 1, background: C.lineSoft, margin: "2px 12px" }} />
            <button onClick={() => { setOpen(false); go("become"); }} style={mobItem}>{t.become}</button>
            <div style={{ height: 1, background: C.lineSoft, margin: "2px 12px" }} />
            {user
              ? <><button onClick={() => { setOpen(false); onDashboard(); }} style={mobItem}>{t.dashboard}</button><div style={{ height: 1, background: C.lineSoft, margin: "2px 12px" }} /><button onClick={() => { setOpen(false); onLogout(); }} style={mobItem}>{t.logout}</button></>
              : <button onClick={() => { setOpen(false); onLogin(); }} style={mobItem}>{t.login}</button>}
            <div style={{ height: 1, background: C.lineSoft, margin: "6px 12px" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "6px 10px 8px" }}>
              {LANGS.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)} style={{ cursor: "pointer", fontFamily: BODY, fontSize: 13, fontWeight: l.code === lang ? 700 : 500, padding: "7px 11px", borderRadius: 999, border: `1px solid ${l.code === lang ? C.ink : C.line}`, background: l.code === lang ? C.ink : C.surface, color: l.code === lang ? "#FFF" : C.inkSoft }}>{l.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const navLink = { background: "none", border: "none", cursor: "pointer", fontFamily: BODY, fontSize: 14.5, fontWeight: 500, color: C.inkSoft, padding: "8px 12px" };
const mobItem = { width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: BODY, fontSize: 16, fontWeight: 500, color: C.ink, padding: "14px 14px", borderRadius: 12 };

/* ============================== HOME ============================== */
function Home({ go, companions, openComp, t }) {
  return (
    <div>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div className="cm-blob" style={{ position: "absolute", top: -120, right: -80, width: 360, height: 360, borderRadius: 999, background: "radial-gradient(circle, #FEE6E0, transparent 70%)", filter: "blur(8px)" }} />
        <div className="cm-blob2" style={{ position: "absolute", top: 40, left: -100, width: 300, height: 300, borderRadius: 999, background: "radial-gradient(circle, #E2F2EF, transparent 70%)", filter: "blur(8px)" }} />
        <div style={{ position: "relative", maxWidth: 880, margin: "0 auto", padding: "70px 22px 44px", textAlign: "center" }}>
          <Pill style={{ background: C.surface, color: C.teal, border: `1px solid ${C.line}`, animation: "fadeUp .6s both" }}><Sparkles size={13} style={{ verticalAlign: -2, marginRight: 5 }} /> {t.heroBadge}</Pill>
          <h1 style={{ fontFamily: HEAD, fontWeight: 800, color: C.ink, letterSpacing: -1.6, fontSize: "clamp(38px, 6.6vw, 68px)", lineHeight: 1.02, margin: "20px auto 0", maxWidth: 720, animation: "fadeUp .6s .08s both" }}>{t.heroA}<span style={{ color: C.coral }}>{t.heroB}</span></h1>
          <p style={{ fontFamily: BODY, fontSize: 19, color: C.inkSoft, lineHeight: 1.5, margin: "20px auto 0", maxWidth: 540, animation: "fadeUp .6s .16s both" }}>{t.heroSub}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 30, animation: "fadeUp .6s .24s both" }}>
            <Btn kind="ghost" onClick={() => go("home", { scroll: "companeros" })}>{t.meet}</Btn>
            <Btn kind="ghost" onClick={() => go("become")}>{t.become}</Btn>
          </div>
        </div>
      </div>

      <div id="how" style={{ background: C.surface, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 22px" }}>
          <h2 style={{ fontFamily: HEAD, fontSize: "clamp(28px,4.2vw,40px)", fontWeight: 800, color: C.ink, margin: "0 0 8px", letterSpacing: -0.6, textAlign: "center" }}>{t.howTitle}</h2>
          <p style={{ fontFamily: BODY, fontSize: 16, color: C.inkSoft, textAlign: "center", margin: "0 auto 40px", maxWidth: 460 }}>{t.howSub}</p>
          <div className="cm-grid3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {[[Search, t.s1t, t.s1d], [MessageCircle, t.s2t, t.s2d], [Heart, t.s3t, t.s3d]].map(([Icon, tt, d], i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 8px", animation: `fadeUp .55s ${i * 0.08}s both` }}>
                <span style={{ width: 54, height: 54, borderRadius: 16, background: "#FEEFEB", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><Icon size={24} color={C.coral} strokeWidth={1.8} /></span>
                <h3 style={{ fontFamily: HEAD, fontSize: 19, fontWeight: 600, color: C.ink, margin: "0 0 7px" }}>{tt}</h3>
                <p style={{ fontFamily: BODY, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section id="companeros">
        <h2 style={{ fontFamily: HEAD, fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: C.ink, margin: "0 0 6px", letterSpacing: -0.6 }}>{t.compTitle}</h2>
        <p style={{ fontFamily: BODY, fontSize: 16, color: C.inkSoft, margin: "0 0 26px" }}>{t.compSub}</p>
        {companions.length === 0 ? (
          <div style={{ background: C.surface, border: `1.5px dashed ${C.line}`, borderRadius: 20, padding: "48px 22px", textAlign: "center" }}>
            <span style={{ width: 60, height: 60, borderRadius: 999, background: "#FEEFEB", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><Users size={28} color={C.coral} /></span>
            <h3 style={{ fontFamily: HEAD, fontSize: 20, fontWeight: 600, color: C.ink, margin: "0 0 6px" }}>{t.emptyTitle}</h3>
            <p style={{ fontFamily: BODY, fontSize: 15, color: C.inkSoft, margin: "0 auto 18px", maxWidth: 380, lineHeight: 1.55 }}>{t.emptyDesc}</p>
            <Btn onClick={() => go("become")}>{t.emptyBtn} <ArrowRight size={17} /></Btn>
          </div>
        ) : (
          <div className="cm-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {companions.map((comp, i) => <CompanionCard key={comp.id} comp={comp} i={i} onOpen={openComp} />)}
          </div>
        )}
      </Section>

      <Section pt={0}>
        <div style={{ background: C.ink, borderRadius: 26, padding: "clamp(30px,6vw,56px)", textAlign: "center" }}>
          <div style={{ maxWidth: 540, margin: "0 auto" }}>
            <Pill style={{ background: "rgba(255,255,255,.1)", color: "#FFD9CF" }}>{t.travPill}</Pill>
            <h2 style={{ fontFamily: HEAD, fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, color: "#FFF", margin: "16px 0 12px", lineHeight: 1.06, letterSpacing: -0.6 }}>{t.travTitle}</h2>
            <p style={{ fontFamily: BODY, fontSize: 16.5, lineHeight: 1.6, margin: "0 0 26px", color: "rgba(255,255,255,.8)" }}>{t.travBody}</p>
            <Btn onClick={() => go("home", { scroll: "companeros" })} style={{ background: "#FFF", color: C.ink }}>{t.meet} <ArrowRight size={18} /></Btn>
          </div>
        </div>
      </Section>

      <Footer go={go} t={t} />
    </div>
  );
}

/* ============================== COMPANION PROFILE ============================== */
function CompanionProfile({ comp, i, go, onRequest, t }) {
  const fn = comp.name.split(" ")[0];
  return (
    <div>
      <Section pt={26}>
        <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: BODY, color: C.inkSoft, fontSize: 14, marginBottom: 18 }}><ArrowLeft size={16} /> {t.back}</button>
        <div className="cm-detail" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.7fr) minmax(280px,1fr)", gap: 38 }}>
          <div>
            <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <Avatar name={comp.name} i={i} size={84} photo={comp.photo} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <h1 style={{ fontFamily: HEAD, fontSize: "clamp(28px,4.6vw,42px)", fontWeight: 800, color: C.ink, margin: 0, letterSpacing: -0.8 }}>{comp.name}</h1>
                  {comp.status === "verified"
                    ? <Pill style={{ background: "#E7F4F2", color: C.teal, padding: "4px 10px" }}><ShieldCheck size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{t.verified}</Pill>
                    : <Pill style={{ background: "#FBEFD9", color: "#9A6B16", padding: "4px 10px" }}><ShieldCheck size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{t.pending}</Pill>}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8, fontFamily: BODY, fontSize: 14, color: C.inkSoft }}>
                  <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><MapPin size={15} color={C.coral} /> {comp.area}</span>
                  {(comp.modes || []).map((m) => { const M = MODES[m]; if (!M) return null; const Icon = M.icon; return (<span key={m} style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Icon size={15} color={C.coral} /> {t[M.key]}</span>); })}
                </div>
              </div>
            </div>
            <h3 style={{ fontFamily: HEAD, fontSize: 20, color: C.ink, margin: "30px 0 10px", fontWeight: 600 }}>{t.loveShare}</h3>
            <p style={{ fontFamily: BODY, fontSize: 16.5, lineHeight: 1.7, color: C.ink, margin: 0, whiteSpace: "pre-wrap" }}>{comp.about}</p>
            <h3 style={{ fontFamily: HEAD, fontSize: 20, color: C.ink, margin: "30px 0 12px", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Star size={18} fill={C.ink} color={C.ink} /> {t.reviews}</h3>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "28px 22px", textAlign: "center" }}>
              <p style={{ fontFamily: BODY, fontSize: 15, color: C.inkSoft, margin: 0, lineHeight: 1.55 }}>{fill(t.noReviews, { name: fn })}</p>
            </div>
          </div>
          <div>
            <div style={{ position: "sticky", top: 84, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, padding: 22, boxShadow: C.shadowHi }}>
              <h3 style={{ fontFamily: HEAD, fontSize: 19, fontWeight: 600, color: C.ink, margin: "0 0 6px" }}>{fill(t.goOut, { name: fn })}</h3>
              <p style={{ fontFamily: BODY, fontSize: 14, color: C.inkSoft, margin: "0 0 16px", lineHeight: 1.5 }}>{t.goOutDesc}</p>
              <Btn onClick={() => onRequest(comp)} style={{ width: "100%" }}>{t.sendReq}</Btn>
              <p style={{ fontFamily: BODY, fontSize: 12.5, color: C.inkDim, textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}><ShieldCheck size={12} style={{ verticalAlign: -2 }} /> {t.secureNote}</p>
            </div>
          </div>
        </div>
      </Section>
      <Footer go={go} t={t} />
    </div>
  );
}

/* ============================== BECOME ============================== */
function Become({ go, onRegister, t }) {
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", area: "", about: "", modes: [], photo: null, terms: false });
  const ok = f.name && f.area && f.about && f.terms && f.photo && f.modes.length > 0;
  const submit = () => { if (!ok) return; onRegister({ id: "c" + Date.now(), ...f }); setDone(true); };
  const handlePhoto = (e) => { const file = e.target.files && e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = () => setF((p) => ({ ...p, photo: r.result })); r.readAsDataURL(file); };
  const toggleMode = (v) => setF((p) => ({ ...p, modes: p.modes.includes(v) ? p.modes.filter((x) => x !== v) : [...p.modes, v] }));
  if (done) {
    return (
      <div>
        <Section pt={42}>
          <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 76, height: 76, borderRadius: 999, background: "#E7F4F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "pop .4s both" }}><Check size={38} color={C.teal} /></div>
            <h1 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 800, color: C.ink, margin: "0 0 12px", letterSpacing: -0.8 }}>{fill(t.welcome, { name: f.name.split(" ")[0] })}</h1>
            <p style={{ fontFamily: BODY, fontSize: 17, color: C.inkSoft, lineHeight: 1.6 }}>{t.welcomeSub}</p>
            <div style={{ textAlign: "left", margin: "24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
              {[[t.n1t, t.n1d], [t.n2t, t.n2d], [t.n3t, t.n3d]].map(([tt, d], i) => (
                <div key={i} style={{ display: "flex", gap: 14, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16, animation: `fadeUp .5s ${i * 0.08}s both` }}>
                  <span style={{ fontFamily: HEAD, fontSize: 22, color: C.coral, fontWeight: 700 }}>{i + 1}</span>
                  <div><strong style={{ fontFamily: HEAD, fontSize: 18, color: C.ink }}>{tt}</strong><p style={{ fontFamily: BODY, fontSize: 14.5, color: C.inkSoft, margin: "4px 0 0", lineHeight: 1.5 }}>{d}</p></div>
                </div>
              ))}
            </div>
            <Btn onClick={() => go("dashboard")}>{t.seeProfile}</Btn>
          </div>
        </Section>
        <Footer go={go} t={t} />
      </div>
    );
  }
  return (
    <div>
      <Section pt={42}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 30px" }}>
          <Pill style={{ background: "#FEEFEB", color: C.coralDeep }}>{t.becomePill}</Pill>
          <h1 style={{ fontFamily: HEAD, fontSize: "clamp(30px,5vw,48px)", fontWeight: 800, color: C.ink, margin: "16px 0 10px", lineHeight: 1.04, letterSpacing: -1 }}>{t.becomeTitle}</h1>
          <p style={{ fontFamily: BODY, fontSize: 17, color: C.inkSoft, lineHeight: 1.6, margin: 0 }}>{t.becomeSub}</p>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, padding: "clamp(22px,4vw,32px)", boxShadow: C.shadow }}>
          <h2 style={{ fontFamily: HEAD, fontSize: 23, fontWeight: 700, color: C.ink, margin: "0 0 20px", letterSpacing: -0.4 }}>{t.formAbout}</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 22 }}>
            <input id="cm-photo" type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            <label htmlFor="cm-photo" style={{ cursor: "pointer", width: 96, height: 96, borderRadius: 999, overflow: "hidden", border: `1.5px ${f.photo ? "solid" : "dashed"} ${f.photo ? C.line : C.coral}`, background: f.photo ? "transparent" : "#FEEFEB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {f.photo ? <img src={f.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={28} color={C.coral} />}
            </label>
            <span style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 600, color: C.inkSoft }}>{f.photo ? t.photo : t.photoCta} <span style={{ color: C.coral }}>*</span></span>
          </div>
          <Field label={t.fName}><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Lucía Hernández" style={field} /></Field>
          <Field label={t.fArea}><input value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })} placeholder="El Médano" style={field} /></Field>
          <Field label={t.fAbout}><textarea value={f.about} onChange={(e) => setF({ ...f, about: e.target.value })} rows={4} placeholder={t.fAboutPh} style={{ ...field, resize: "vertical" }} /></Field>
          <Field label={t.getAround}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["car", "bike", "walk"].map((v) => { const M = MODES[v]; const Icon = M.icon; const on = f.modes.includes(v); return (
                <button key={v} onClick={() => toggleMode(v)} style={{ flex: 1, minWidth: 96, cursor: "pointer", fontFamily: BODY, fontSize: 14.5, fontWeight: 600, padding: "12px", borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, border: `1px solid ${on ? C.ink : C.line}`, background: on ? C.ink : C.bg, color: on ? "#FFF" : C.inkSoft }}><Icon size={17} color={on ? "#FFF" : C.coral} /> {t[M.key]}</button>
              ); })}
            </div>
          </Field>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", margin: "8px 0 22px" }}>
            <input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} style={{ marginTop: 4, accentColor: C.coral }} />
            <span style={{ fontFamily: BODY, fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>{t.terms}</span>
          </label>
          <Btn onClick={submit} style={{ width: "100%", opacity: ok ? 1 : 0.5 }}>{t.submit}</Btn>
        </div>
      </Section>
      <Footer go={go} t={t} />
    </div>
  );
}
const field = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.line}`, fontFamily: BODY, fontSize: 15, color: C.ink, background: C.bg, outline: "none" };
const Field = ({ label, children }) => (<div style={{ marginBottom: 16 }}><label style={{ display: "block", fontFamily: BODY, fontSize: 13.5, fontWeight: 600, color: C.inkSoft, marginBottom: 7 }}>{label}</label>{children}</div>);

/* ============================== REQUEST + SENT ============================== */
function RequestModal({ comp, i, onClose, onConfirm, t }) {
  const fn = comp.name.split(" ")[0];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(33,37,31,.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn .25s both" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, borderRadius: 22, maxWidth: 420, width: "100%", overflow: "hidden", animation: "pop .3s both", padding: 12 }}>
        <CompanionMark name={comp.name} i={i} h={120} size={48} photo={comp.photo} />
        <div style={{ padding: "16px 16px 18px" }}>
          <h2 style={{ fontFamily: HEAD, fontSize: 22, fontWeight: 700, color: C.ink, margin: "0 0 4px", letterSpacing: -0.4 }}>{fill(t.reqTitle, { name: fn })}</h2>
          <p style={{ fontFamily: BODY, fontSize: 14.5, color: C.inkSoft, margin: "0 0 16px", lineHeight: 1.55 }}>{fill(t.reqBody, { name: fn })}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn kind="ghost" onClick={onClose} style={{ flex: 1 }}>{t.cancel}</Btn>
            <Btn onClick={onConfirm} style={{ flex: 1.5 }}>{t.sendRequest}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
function Sent({ comp, go, t }) {
  const fn = comp.name.split(" ")[0];
  return (
    <div>
      <Section pt={42}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: 999, background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 14px 30px -10px rgba(241,91,69,.55)", animation: "pop .4s both" }}><Check size={42} color="#FFF" /></div>
          <h1 style={{ fontFamily: HEAD, fontSize: 38, fontWeight: 800, color: C.ink, margin: "0 0 12px", letterSpacing: -0.8 }}>{t.sentTitle}</h1>
          <p style={{ fontFamily: BODY, fontSize: 17, color: C.inkSoft, lineHeight: 1.6 }}>{fill(t.sentBody, { name: fn })}</p>
          <div style={{ marginTop: 26 }}><Btn onClick={() => go("home")}>{t.backHome}</Btn></div>
        </div>
      </Section>
      <Footer go={go} t={t} />
    </div>
  );
}

/* ============================== AUTH (login / signup) ============================== */
function Auth({ t, go, onAuthed }) {
  const [mode, setMode] = useState("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!email || !pw) return;
    setErr(""); setBusy(true);
    const { error } = mode === "up"
      ? await supabase.auth.signUp({ email, password: pw })
      : await supabase.auth.signInWithPassword({ email, password: pw });
    setBusy(false);
    if (error) setErr(error.message); else onAuthed();
  };
  return (
    <div>
      <Section pt={42}>
        <div style={{ maxWidth: 420, margin: "0 auto", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, padding: "clamp(22px,4vw,32px)", boxShadow: C.shadow }}>
          <h1 style={{ fontFamily: HEAD, fontSize: 28, fontWeight: 800, color: C.ink, margin: "0 0 18px", letterSpacing: -0.6 }}>{mode === "up" ? t.createAccount : t.welcomeBack}</h1>
          <Field label={t.email}><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={field} /></Field>
          <Field label={t.password}><input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} style={field} /></Field>
          {err && <p style={{ fontFamily: BODY, fontSize: 13.5, color: C.coralDeep, margin: "0 0 12px", lineHeight: 1.5 }}>{err}</p>}
          <Btn onClick={submit} style={{ width: "100%", opacity: busy ? 0.6 : 1 }}>{mode === "up" ? t.signup : t.login}</Btn>
          <button onClick={() => { setMode(mode === "up" ? "in" : "up"); setErr(""); }} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: BODY, fontSize: 13.5, color: C.inkSoft, marginTop: 14 }}>{mode === "up" ? t.toLogin : t.toSignup}</button>
        </div>
      </Section>
      <Footer go={go} t={t} />
    </div>
  );
}

/* ============================== DASHBOARD ============================== */
function ReqRow({ title, sub, status }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
      <span style={{ width: 38, height: 38, borderRadius: 999, background: "#FEEFEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageCircle size={18} color={C.coral} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ fontFamily: HEAD, fontSize: 15, color: C.ink, display: "block" }}>{title}</strong>
        <span style={{ fontFamily: BODY, fontSize: 13, color: C.inkSoft }}>{sub}</span>
      </div>
      <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 600, color: C.inkSoft, textTransform: "capitalize" }}>{status}</span>
    </div>
  );
}
function Dashboard({ t, go, user, myProfile, sent, received, onViewProfile }) {
  const dt = (s) => { try { return new Date(s).toLocaleDateString(); } catch { return ""; } };
  return (
    <div>
      <Section pt={36}>
        <h1 style={{ fontFamily: HEAD, fontSize: "clamp(28px,5vw,42px)", fontWeight: 800, color: C.ink, margin: 0, letterSpacing: -0.8 }}>{t.dashTitle}</h1>
        <p style={{ fontFamily: BODY, fontSize: 15, color: C.inkSoft, margin: "8px 0 28px" }}>{fill(t.dashHi, { email: user?.email || "" })}</p>

        {myProfile ? (
          <>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, padding: 22, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar name={myProfile.name} i={0} size={56} photo={myProfile.photo} />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontFamily: HEAD, fontSize: 19, color: C.ink }}>{myProfile.name}</strong>
                  <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.inkSoft, display: "inline-flex", alignItems: "center", gap: 5 }}><MapPin size={13} color={C.coral} /> {myProfile.area}</div>
                </div>
                {myProfile.status === "verified"
                  ? <Pill style={{ background: "#E7F4F2", color: C.teal }}><ShieldCheck size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{t.verified}</Pill>
                  : <Pill style={{ background: "#FBEFD9", color: "#9A6B16" }}><ShieldCheck size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{t.pending}</Pill>}
              </div>
              {/* onboarding checklist */}
              <div style={{ marginTop: 18, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
                <p style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.inkDim, margin: "0 0 12px" }}>{t.dashSetup}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={13} color="#FFF" /></span>
                  <span style={{ fontFamily: BODY, fontSize: 14.5, color: C.ink }}>{t.dashStep1}</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${myProfile.status === "verified" ? C.teal : "#E0C48A"}`, background: myProfile.status === "verified" ? C.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{myProfile.status === "verified" && <Check size={12} color="#FFF" />}</span>
                  <div>
                    <span style={{ fontFamily: BODY, fontSize: 14.5, color: C.ink, fontWeight: 600 }}>{t.dashStep2}</span>
                    <p style={{ fontFamily: BODY, fontSize: 13, color: C.inkSoft, margin: "2px 0 0", lineHeight: 1.5 }}>{t.dashStep2sub}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => onViewProfile(myProfile)} style={{ marginTop: 16, background: "none", border: "none", cursor: "pointer", fontFamily: BODY, fontSize: 13.5, fontWeight: 600, color: C.coral, display: "inline-flex", alignItems: "center", gap: 5, padding: 0 }}>{t.dashViewPublic} <ArrowRight size={14} /></button>
            </div>

            <h3 style={{ fontFamily: HEAD, fontSize: 19, fontWeight: 700, color: C.ink, margin: "26px 0 12px" }}>{t.dashReceived}</h3>
            {received.length === 0
              ? <p style={{ fontFamily: BODY, fontSize: 14.5, color: C.inkSoft }}>{t.dashNoReceived}</p>
              : received.map((r) => <ReqRow key={r.id} title={r.traveller_email} sub={dt(r.created_at)} status={r.status} />)}
          </>
        ) : (
          <div style={{ background: C.surface, border: `1.5px dashed ${C.line}`, borderRadius: 20, padding: "36px 22px", textAlign: "center", marginBottom: 16 }}>
            <span style={{ width: 56, height: 56, borderRadius: 999, background: "#FEEFEB", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Compass size={26} color={C.coral} /></span>
            <p style={{ fontFamily: BODY, fontSize: 15.5, color: C.ink, margin: "0 auto 16px", maxWidth: 360, lineHeight: 1.55 }}>{t.dashNoProfile}</p>
            <Btn onClick={() => go("become")}>{t.dashBecomeCta} <ArrowRight size={17} /></Btn>
          </div>
        )}

        <h3 style={{ fontFamily: HEAD, fontSize: 19, fontWeight: 700, color: C.ink, margin: "26px 0 12px" }}>{t.dashSent}</h3>
        {sent.length === 0
          ? <p style={{ fontFamily: BODY, fontSize: 14.5, color: C.inkSoft }}>{t.dashNoSent}</p>
          : sent.map((r) => <ReqRow key={r.id} title={r.companero_name} sub={dt(r.created_at)} status={r.status} />)}
      </Section>
      <Footer go={go} t={t} />
    </div>
  );
}

/* ============================== LAYOUT ============================== */
const Section = ({ children, pt = 56, id }) => (<div id={id} style={{ maxWidth: 1080, margin: "0 auto", padding: `${pt}px 22px 56px` }}>{children}</div>);
function Footer({ go, t }) {
  return (
    <footer style={{ background: C.surface, color: C.inkSoft, borderTop: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 22px 28px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 26, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: C.coral, display: "flex", alignItems: "center", justifyContent: "center" }}><Compass size={16} color="#FFF" /></span>
            <span style={{ fontFamily: HEAD, fontSize: 20, fontWeight: 700, color: C.ink }}>Compañero</span>
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontFamily: BODY, fontSize: 13.5 }}>
            <span style={{ cursor: "pointer" }} onClick={() => go("home", { scroll: "companeros" })}>{t.meet}</span>
            <span style={{ cursor: "pointer" }} onClick={() => go("become")}>{t.become}</span>
            <span style={{ cursor: "pointer" }}>{t.fTrust}</span>
            <span style={{ cursor: "pointer" }}>{t.fContact}</span>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 24, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontFamily: BODY, fontSize: 12.5 }}>
          <span>{fill(t.copyright, { year: new Date().getFullYear() })}</span>
          <span>{t.rights}</span>
        </div>
      </div>
    </footer>
  );
}

/* ============================== APP ============================== */
const TEST_COMPANION = { id: "c-test", name: "Test", area: "Santa Cruz · Tenerife", modes: ["car", "walk"], status: "verified",
  about: "Hi — I'm a sample profile so you can see how a Compañero looks. This is where I'd tell you about my favourite corners of the island: the quiet coves, a guachinche my family loves, and the best spot to watch the sun go down over the Atlantic." };

export default function App() {
  const [view, setView] = useState("home");
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [authNext, setAuthNext] = useState("home");
  const [companions, setCompanions] = useState([TEST_COMPANION]);
  const [myProfile, setMyProfile] = useState(null);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [sentComp, setSentComp] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const t = TR[lang];

  const go = (v, opts = {}) => {
    setView(v);
    if (opts.scroll) setTimeout(() => { const el = document.getElementById(opts.scroll); if (el) el.scrollIntoView({ behavior: "smooth" }); else window.scrollTo({ top: 0 }); }, 60);
    else window.scrollTo({ top: 0 });
  };
  const openComp = (c) => { setSelected(c); setView("profile"); window.scrollTo({ top: 0 }); };
  useEffect(() => { const s = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", s); return () => window.removeEventListener("scroll", s); }, []);

  // Track who is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load saved compañeros from the database on first load
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("companeros").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        const rows = data.map(mapRow);
        setCompanions([TEST_COMPANION, ...rows]);
      }
    })();
  }, []);

  // Save a new compañero: upload the photo to storage, then insert the row
  const addCompanion = async (c) => {
    setCompanions((p) => [...p, { ...c, status: "pending" }]); // show immediately
    try {
      let photo_url = null;
      if (c.photo && c.photo.startsWith("data:")) {
        const blob = await (await fetch(c.photo)).blob();
        const ext = ((blob.type.split("/")[1] || "jpg").split("+")[0]).split(";")[0];
        const path = `${c.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("photos").upload(path, blob, { contentType: blob.type, upsert: true });
        if (!upErr) photo_url = supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
      }
      await supabase.from("companeros").insert({ name: c.name, area: c.area, about: c.about, modes: c.modes, photo_url, status: "pending", user_id: user?.id ?? null });
    } catch (e) { console.error("save failed", e); }
  };

  const idxOf = (c) => Math.max(0, companions.findIndex((x) => x.id === c.id));

  // Load dashboard data (my profile + my sent/received requests)
  useEffect(() => {
    if (view !== "dashboard" || !user) return;
    (async () => {
      const { data: prof } = await supabase.from("companeros").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1);
      setMyProfile(prof && prof[0] ? mapRow(prof[0]) : null);
      const { data: s } = await supabase.from("requests").select("*").eq("traveller_id", user.id).order("created_at", { ascending: false });
      setSent(s || []);
      const { data: r } = await supabase.from("requests").select("*").eq("companero_user_id", user.id).order("created_at", { ascending: false });
      setReceived(r || []);
    })();
  }, [view, user]);

  // Save a request to the database
  const confirmRequest = async (comp) => {
    try {
      const cid = /^[0-9a-f-]{36}$/i.test(comp.id || "") ? comp.id : null;
      await supabase.from("requests").insert({ companero_id: cid, companero_name: comp.name, companero_user_id: comp.user_id ?? null, traveller_id: user.id, traveller_email: user.email });
    } catch (e) { console.error("request failed", e); }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        body { margin: 0; background: ${C.bg}; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px);} to { opacity:1; transform:none; } }
        @keyframes fadeIn { from { opacity:0;} to { opacity:1; } }
        @keyframes pop { from { opacity:0; transform: scale(.94);} to { opacity:1; transform: scale(1);} }
        @keyframes shimmer { 0% { transform: translateX(-160%);} 100% { transform: translateX(320%);} }
        @keyframes floaty { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }
        @keyframes blob { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(20px,18px) scale(1.08);} }
        .cm-shimmer { animation: shimmer 3.4s ease-in-out infinite; }
        .cm-floaty { animation: floaty 4s ease-in-out infinite; }
        .cm-blob { animation: blob 14s ease-in-out infinite; }
        .cm-blob2 { animation: blob 18s ease-in-out infinite reverse; }
        @media (max-width: 980px) { .cm-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 760px) {
          .cm-desk { display:none !important; }
          .cm-detail { grid-template-columns: 1fr !important; }
          .cm-grid { grid-template-columns: repeat(2,1fr) !important; }
          .cm-grid3 { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 761px) { .cm-mob { display:none !important; } }
      `}</style>
      <Nav go={go} solid={scrolled || view !== "home"} t={t} lang={lang} setLang={setLang} user={user} onLogin={() => { setAuthNext("dashboard"); go("auth"); }} onLogout={() => supabase.auth.signOut()} onDashboard={() => go("dashboard")} />
      {view === "home" && <Home go={go} companions={companions} openComp={openComp} t={t} />}
      {view === "become" && (user ? <Become go={go} onRegister={(c) => addCompanion(c)} t={t} /> : <Auth t={t} go={go} onAuthed={() => go("become")} />)}
      {view === "auth" && <Auth t={t} go={go} onAuthed={() => go(authNext)} />}
      {view === "dashboard" && (user ? <Dashboard t={t} go={go} user={user} myProfile={myProfile} sent={sent} received={received} onViewProfile={openComp} /> : <Auth t={t} go={go} onAuthed={() => go("dashboard")} />)}
      {view === "profile" && selected && <CompanionProfile comp={selected} i={idxOf(selected)} go={go} onRequest={(c) => { if (user) setModal(c); else { setAuthNext("profile"); go("auth"); } }} t={t} />}
      {view === "sent" && sentComp && <Sent comp={sentComp} go={go} t={t} />}
      {modal && <RequestModal comp={modal} i={idxOf(modal)} onClose={() => setModal(null)} onConfirm={() => { confirmRequest(modal); setSentComp(modal); setModal(null); go("sent"); }} t={t} />}
    </div>
  );
}
