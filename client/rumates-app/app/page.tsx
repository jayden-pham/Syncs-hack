"use client"

import { useState } from "react"
import LandingPage from "./landing/page"
import LoginPage from "./login/page"
import OopsPage from "./oops/page"
import PersonalInfoPage from "./personal-info/page"
import PhotoPage from "./photo/page"
import InterestsPage from "./interests/page"
import FindPeoplePage from "./find-people/page"
import PreferencesPage from "./preferences/page"
import RedGreenFlagsPage from "./red-green-flags/page"
import FindPlacePage from "./find-place/page"
import BudgetCityPage from "./budget-city/page"
import WelcomePage from "./welcome/page"
import SwipingPage from "./swiping/page"
import ChatPage from "./chat/page"
import ListingsPage from "./listings/page"
import ChatDreamTeamPage from "./chat-the-dream-team/page"
import ListingMelbourneApartmentPage from "./listing-melbourne-apartment/page"
import FiltersPage from "./filters/page"

type Page =
  | "landing"
  | "login"
  | "oops"
  | "personal-info"
  | "photo"
  | "interests"
  | "find-people"
  | "preferences"
  | "red-green-flags"
  | "find-place"
  | "living-preferences"
  | "welcome"
  | "swiping"
  | "chat"
  | "listings"
  | "budget-city"
  | "chat-the-dream-team"
  | "listing-melbourne-apartment"
  | "filters"

export default function RumatesApp() {
  const [currentPage, setCurrentPage] = useState<Page>("landing")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthday, setBirthday] = useState("")
  const [gender, setGender] = useState("")
  const [redFlag, setRedFlag] = useState("")
  const [greenFlag, setGreenFlag] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [city, setCity] = useState("")
  const [budget, setBudget] = useState("")

  const pageProps = {
    setCurrentPage,
    username,
    setUsername,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    birthday,
    setBirthday,
    gender,
    setGender,
    redFlag,
    setRedFlag,
    greenFlag,
    setGreenFlag,
    selectedInterests,
    setSelectedInterests,
    city,
    setCity,
    budget,
    setBudget,
  }

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage {...pageProps} />
      case "login":
        return <LoginPage {...pageProps} />
      case "oops":
        return <OopsPage {...pageProps} />
      case "personal-info":
        return <PersonalInfoPage {...pageProps} />
      case "photo":
        return <PhotoPage {...pageProps} />
      case "interests":
        return <InterestsPage {...pageProps} />
      case "find-people":
        return <FindPeoplePage {...pageProps} />
      case "preferences":
        return <PreferencesPage {...pageProps} />
      case "red-green-flags":
        return <RedGreenFlagsPage {...pageProps} />
      case "find-place":
        return <FindPlacePage {...pageProps} />
      case "budget-city":
        return <BudgetCityPage {...pageProps} />
      case "welcome":
        return <WelcomePage {...pageProps} />
      case "swiping":
        return <SwipingPage {...pageProps} />
      case "chat":
        return <ChatPage {...pageProps} />
      case "listings":
        return <ListingsPage {...pageProps} />
      case "chat-the-dream-team":
        return <ChatDreamTeamPage {...pageProps} />
      case "listing-melbourne-apartment":
        return <ListingMelbourneApartmentPage {...pageProps} />
      case "filters":
        return <FiltersPage {...pageProps} />
      default:
        return <LandingPage {...pageProps} />
    }
  }

  return renderPage()
}
