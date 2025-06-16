// import LabeledSwitch from "@/components/labeled-switch";

// import { SelectMaterialsView } from "@/components/add-materials-section/components/select-materials-view";
// import { UploadMaterialsView } from "@/components/add-materials-section/components/upload-materials-view";

// import { type Doc } from "convex/_generated/dataModel";
// import { type Control, type UseFormSetValue } from "react-hook-form";
// import { type LessonFormData } from "@/types/lesson";

// interface LessonFormMaterialsViewProps {
//   showExistingMaterials: boolean;
//   setValue: UseFormSetValue<LessonFormData>;
//   materialsToUpload: File[];
//   control: Control<LessonFormData>;
//   allMaterials?: Doc<"pdfs">[];
// }

// export default function LessonFormMaterialsView({
//   showExistingMaterials,
//   setValue,
//   materialsToUpload,
//   control,
//   allMaterials,
// }: LessonFormMaterialsViewProps) {
//   return (
//     <>
//       <LabeledSwitch
//         id="select-from-uploaded"
//         checked={showExistingMaterials}
//         onCheckedChange={(checked) =>
//           setValue("showExistingMaterials", checked)
//         }
//         label="Select from already uploaded materials"
//       />

//       {!showExistingMaterials ? (
//         <UploadMaterialsView
//           materialsToUpload={materialsToUpload}
//           setValue={setValue}
//         />
//       ) : (
//         <SelectMaterialsView control={control} allMaterials={allMaterials} />
//       )}
//     </>
//   );
// }
