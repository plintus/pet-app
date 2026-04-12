export type Pet = {
  id: string;
  name: string;
  type: string;
  breed?: string;
  dateOfBirth?: string;
  age?: number;
  notes?: string;
  photoUrl?: string;
};

export type AllergyReaction =
  | "hives"
  | "rash"
  | "swelling"
  | "vomiting"
  | "itching"
  | "trouble breathing"
  | "other";

export type AllergySeverity = "mild" | "severe";

export type Vaccine = {
  id: string;
  name: string;
  dateAdministered: string;
};

export type Allergy = {
  id: string;
  name: string;
  reactions: AllergyReaction[];
  severity: AllergySeverity;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
};
