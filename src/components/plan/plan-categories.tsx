import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as icons from "lucide-react";

interface Category {
  name: string;
  description: string;
  icon: string;
}

interface PlanCategoriesProps {
  categories: Category[];
}

export function PlanCategories({ categories }: PlanCategoriesProps) {
  // Function to get icon component by name (ri-* format)
  const getIcon = (iconName: string) => {
    // Convert ri-user-line to UserIcon
    const name = iconName
      .replace(/^ri-/, "")
      .replace(/-line$/, "")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    // Add "Icon" suffix if not present
    const iconComponentName = name.endsWith("Icon") ? name : name + "Icon";

    // @ts-expect-error - dynamic access to icons object
    return icons[iconComponentName] || icons.HelpCircle;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = getIcon(category.icon);
            return (
              <Card key={category.name}>
                <CardContent className="">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
