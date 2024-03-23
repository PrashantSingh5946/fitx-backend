declare type CreateFitnessPreferenceParams = {
  goal: "weightGain" | "weightLoss" | "endurance";
  dailyWaterIntakeGoal: number | null;
  userId: string;
};

declare type CreateMeasurementParams = {
  height: number;
  weight: number;
  measurementUnit: string;
  bmi: number;
  bmr: number;
  maintenanceCalories: number;
  userId: string;
};

// ====== USER PARAMS
declare type CreateUserParams = {
  email: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  avatar: string;
};

declare type Nutrition = {
  protein: string;
  carb: string;
  fat: string;
};

declare type CreateRecipeParams = {
  name: string;
  tags: string[];
  ingredients: string[];
  creatorId: string;
  recipe: string;
  nutrition: Nutrition;
};

declare type CreateActivityParams = {
  activityType: "Food" | "Water" | "Workout" | "Sleep";
  activityMeasurement: number;
  activityMeasurementUnit: string;
  userId: string;
};
