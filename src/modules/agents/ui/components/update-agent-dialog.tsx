import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Agentform } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
    open : boolean;
    onOpenChange: (open:boolean) => void;
    initialValues:AgentGetOne;
}

export const UpdateAgentDialog = ({
    open,
    onOpenChange,
    initialValues,
} : UpdateAgentDialogProps) =>{
    return(
        <ResponsiveDialog
        title="Edit Agent"
        description="Edit the agent details"
        open={open}
        onOpenChange={onOpenChange}
        >
        
        <Agentform onSuccess={()=>onOpenChange(false)} onCancel={()=>onOpenChange(false)} initialValues={initialValues} />


        </ResponsiveDialog>
    )
}