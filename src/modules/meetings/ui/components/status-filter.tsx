import { CircleXIcon,
    CircleCheckIcon,
    VideoIcon,
    LoaderIcon,
    ClockArrowUpIcon
} from "lucide-react";
import { meetingStatus } from "../../types";
import { useMeetingFilters } from "../../hooks/use-meetings-filters";
import { CommandSelect } from "@/components/command-select";

const options = [
    {
        id: meetingStatus.Upcoming,
        value: meetingStatus.Upcoming,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <ClockArrowUpIcon/>
                {meetingStatus.Upcoming}
            </div>
        )
    },
    {
        id: meetingStatus.Completed,
        value: meetingStatus.Completed,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleCheckIcon/>
                {meetingStatus.Completed}
            </div>
        )
    },
     {
        id: meetingStatus.Active,
        value: meetingStatus.Active,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <VideoIcon/>
                {meetingStatus.Active}
            </div>
        )
    },
    {
        id: meetingStatus.Processing,
        value: meetingStatus.Processing,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <LoaderIcon/>
                {meetingStatus.Processing}
            </div>
        )
    },
     {
        id: meetingStatus.Cancelled,
        value: meetingStatus.Cancelled,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleXIcon/>
                {meetingStatus.Cancelled}
            </div>
        )
    }
]

export const StatusFilter = ()=>{
    const [filters,setFilters] = useMeetingFilters();

    return (
        <CommandSelect
            placeholder="Status"
            className="h-9"
            options={options}
            onSelect={(value) => setFilters({status : value as meetingStatus})}
            value={filters.status ?? ""}
        />
    )
}