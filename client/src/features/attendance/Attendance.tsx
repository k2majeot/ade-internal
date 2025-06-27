import { useState, useEffect, useMemo } from "react";
import { startOfToday, format, parse } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { getAttendance, upsertAttendance } from "@/api/attendance";
import type {
  AttendanceQuery,
  Attendance,
  AttendanceList,
} from "@shared/validation";
import type { ApiResult } from "@/types/apiTypes";
import { Present } from "@shared/types";

import AttendanceTable from "./AttendanceTable";
import { AttendanceButtons, AttendanceFilters } from "./AttendanceControls";

type AttendanceUi = {
  data: Attendance;
  isDirty: boolean;
  original: Present;
};

export default function Attendance() {
  const [date, setDate] = useState<Date>(startOfToday());
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<AttendanceUi[]>([]);
  const [edit, setEdit] = useState(false);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((entry) => {
      const fullName = `${entry.data.fname} ${entry.data.lname}`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    });
  }, [attendance, search]);

  const fetchAttendance = async () => {
    const query: AttendanceQuery = { date };
    const result: ApiResult<AttendanceList> = await getAttendance(query);
    if (!result.success) {
      setAttendance([]);
      return;
    }

    setAttendance(
      result.data.map((entry) => {
        const present = entry.present ?? Present.NotScheduled;
        return {
          data: { ...entry, present },
          original: present,
          isDirty: true,
        };
      })
    );
  };

  useEffect(() => {
    setEdit(
      format(date, "yyyy-MM-dd") === format(startOfToday(), "yyyy-MM-dd")
    );
    void fetchAttendance();
  }, [date]);

  const onPresentChange = (cid: number, val: Present) => {
    setAttendance((prev) =>
      prev.map((entry) =>
        entry.data.cid === cid
          ? {
              ...entry,
              data: { ...entry.data, present: val },
              isDirty: val !== entry.original,
            }
          : entry
      )
    );
  };

  const onCancel = () => {
    setAttendance((prev) =>
      prev.map((entry) => ({
        ...entry,
        data: { ...entry.data, present: entry.original },
        isDirty: false,
      }))
    );
    setEdit(false);
  };

  const onSubmit = async () => {
    const attendanceList = attendance.map((entry) => ({
      cid: entry.data.cid,
      present: entry.data.present,
      attendance_date: date,
    }));

    const result = await upsertAttendance(attendanceList);
    if (!result.success) {
      toast("Submission failed");
      return;
    }

    toast("Submission successful");
    setEdit(false);

    setAttendance((prev) =>
      prev.map((entry) => ({
        ...entry,
        original: entry.data.present,
        isDirty: false,
      }))
    );
  };

  return (
    <Card className="flex flex-col bg-transparent border-none shadow-none">
      <CardHeader>
        <div className="flex">
          <CardTitle>Attendance</CardTitle>
          <AttendanceButtons
            edit={edit}
            onEdit={() => setEdit(true)}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <AttendanceFilters
            date={date}
            search={search}
            onDateChange={setDate}
            onSearchChange={setSearch}
          />
          <AttendanceTable
            data={filteredAttendance}
            edit={edit}
            onPresentChange={onPresentChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
