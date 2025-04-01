import { CategoryType, ExpenseCategoriesType } from "@/types";
import { colors } from "./theme";
import * as Icons from "phosphor-react-native" 

export const expenseCategories: ExpenseCategoriesType = {
    groceries: {
        label: "Groceries",
        value: "groceries",
        icon: Icons.ShoppingCart,
        bgColor: "#485563"
    },
    rent: {
        label: "Rent",
        value: "rent",
        icon: Icons.House,
        bgColor: "075985"
    },
    utilities: {
        label: "Utilities",
        value: "utilities",
        icon: Icons.Lightbulb,
        bgColor: "#ca8a04" 
    },
    transportation: {
        label: "Transportation",
        value: "transportation",
        icon: Icons.Car,
        bgColor: "#b45309"
    },
    entertainment: {
        label: "Entertainment",
        value: "entertainment",
        icon: Icons.FilmStrip,
        bgColor: "0f766e"
    },
    personal: {
        label: "Personal",
        value: "personal",
        icon: Icons.User,
        bgColor: "#a21caf"
    },
    others: {
        label: "Others",
        value: "others",
        icon: Icons.DotsThreeOutline,
        bgColor: "#525252"
    },
    clothing: {
        label: "Clothing",
        value: "clothing",
        icon: Icons.TShirt,
        bgColor: "#7c3aed"
    },
    savings: {
        label: "Savings",
        value: "savings",
        icon: Icons.PiggyBank,
        bgColor: "#065F46"
    },

}

export const incomeCategory: CategoryType = {
    label: "Income",
    value: "income",
    icon: Icons.CurrencyDollarSimple,
    bgColor: "#525252"
}

export const transactionType = [
    {label: "Expense",value: "expense"},
    {label: "Income",value: "income"},
]