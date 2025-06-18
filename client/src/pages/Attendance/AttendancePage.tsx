import { useState, useEffect, useMemo } from "react";
import { startOfToday, format, parse } from "date-fns";

import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

import type {
  AttendanceQuery,
  Attendance,
  AttendanceList,
} from "@shared/validation";
import { getAttendance, upsertAttendance } from "@/api/attendance";
import { Present } from "@shared/types";
import type { ApiResult } from "@/types/apiTypes";

type AttendanceUi = {
  data: Attendance;
  isDirty: boolean;
  original: Present;
};

export default function Attendance() {
  const [date, setDate] = useState<Date>(startOfToday());
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<AttendanceUi[]>([]);
  const filteredAttendance = useMemo(() => {
    return attendance.filter((entry) => {
      const fullName = `${entry.data.fname} ${entry.data.lname}`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    });
  }, [attendance, search]);
  const [edit, setEdit] = useState(false);

  async function fetchAttendance() {
    const query: AttendanceQuery = { date };
    const result: ApiResult<AttendanceList> = await getAttendance(query);
    if (!result.success) {
      setAttendance([]);
      return;
    }
    const displayList: AttendanceUi[] = result.data.map((element) => {
      const present = element.present ?? Present.NotScheduled;

      return {
        data: {
          ...element,
          present,
        },
        original: present,
        isDirty: true,
      };
    });
    setAttendance(displayList);
  }

  useEffect(() => {
    if (format(date, "yyyy-MM-dd") === format(startOfToday(), "yyyy-MM-dd")) {
      setEdit(true);
    } else {
      setEdit(false);
    }

    fetchAttendance();
  }, [date]);

  function onPresentChange(cid: number, val: Present) {
    setAttendance((prev) =>
      prev.map((entry) =>
        entry.data.cid === cid
          ? {
              ...entry,
              data: {
                ...entry.data,
                present: val,
              },
              isDirty: val !== entry.original,
            }
          : entry
      )
    );
  }

  function onCancel() {
    setAttendance((prev) =>
      prev.map((entry) => ({
        ...entry,
        data: {
          ...entry.data,
          present: entry.original,
        },
        isDirty: false,
      }))
    );
    setEdit(false);
  }

  async function onSubmit() {
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
  }

  const textColorMap: Record<Present, string> = {
    [Present.Here]: "text-green-500",
    [Present.Absent]: "text-red-500",
    [Present.NotScheduled]: "text-blue-500",
  };

  const stateColorMap: Record<Present, string> = {
    [Present.Here]: "data-[state=on]:text-green-500",
    [Present.Absent]: "data-[state=on]:text-red-500",
    [Present.NotScheduled]: "data-[state=on]:text-blue-500",
  };

  return (
    <Card className="flex flex-col mb-8 w-full lg:w-1/2 bg-transparent border-none shadow-none">
      <CardHeader>
        <div className="flex">
          <CardTitle>Attendance</CardTitle>
          <div className="flex gap-1 ml-auto">
            <Button
              variant="secondary"
              onClick={() => setEdit(true)}
              disabled={edit}
            >
              Edit
            </Button>
            <Button variant="secondary" onClick={onCancel} disabled={!edit}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={onSubmit} disabled={!edit}>
              Submit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-1">
            <Input
              type="date"
              value={format(date, "yyyy-MM-dd")}
              onChange={(e) =>
                setDate(parse(e.target.value, "yyyy-MM-dd", new Date()))
              }
            />
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length ? (
                filteredAttendance.map((row) => (
                  <TableRow key={row.data.cid}>
                    <TableCell className={textColorMap[row.data.present]}>
                      {row.data.lname}, {row.data.fname}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <ToggleGroup
                          variant="outline"
                          type="single"
                          value={row.data.present || Present.NotScheduled}
                          onValueChange={(val) => {
                            if (val) onPresentChange(row.data.cid, val);
                          }}
                          disabled={!edit}
                        >
                          <ToggleGroupItem
                            value={Present.Here}
                            className={stateColorMap[Present.Here]}
                          >
                            ✓
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value={Present.Absent}
                            className={stateColorMap[Present.Absent]}
                          >
                            ✗
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value={Present.NotScheduled}
                            className={stateColorMap[Present.NotScheduled]}
                          >
                            –
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No attendance data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
