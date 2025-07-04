import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Badge
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  Check,
  X,
  Mail,
  IdCard,
  CreditCard
} from "lucide-react";

const ModeratorTable = ({ moderatorApplications, handleModeratorAction, getStatusColor, maskAadhaar, maskPAN }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow style={{ borderColor: '#3A3F4C' }}>
          <TableHead className="text-gray-300">Name</TableHead>
          <TableHead className="text-gray-300">Contact</TableHead>
          <TableHead className="text-gray-300">KYC Details</TableHead>
          <TableHead className="text-gray-300">Experience</TableHead>
          <TableHead className="text-gray-300">Status</TableHead>
          <TableHead className="text-gray-300">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {moderatorApplications.map((application) => (
          <TableRow key={application.id} style={{ borderColor: '#3A3F4C' }}>
            <TableCell className="text-white font-medium">{application.name}</TableCell>
            <TableCell className="text-gray-300">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {application.email}
                </div>
                <div>{application.phone}</div>
              </div>
            </TableCell>
            <TableCell className="text-gray-300">
              <div className="space-y-1">
                <div className="flex items-center">
                  <IdCard className="h-3 w-3 mr-1" />
                  {maskAadhaar(application.aadhaarNumber)}
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-3 w-3 mr-1" />
                  {maskPAN(application.panNumber)}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-gray-300">{application.experience}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(application.status)}>
                {application.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {application.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleModeratorAction(application.id, 'approve')}
                      style={{ backgroundColor: '#10B981' }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleModeratorAction(application.id, 'reject')}
                      style={{ backgroundColor: '#EF4444' }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" style={{ borderColor: '#3A3F4C', color: '#9b87f5' }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
                    <DialogHeader>
                      <DialogTitle className="text-white">Application Details</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Complete moderator application information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Full Name:</label>
                        <p className="text-white">{application.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Email:</label>
                        <p className="text-white">{application.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Phone:</label>
                        <p className="text-white">{application.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Aadhaar Number:</label>
                        <p className="text-white">{application.aadhaarNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">PAN Number:</label>
                        <p className="text-white">{application.panNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Address:</label>
                        <p className="text-white">{application.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Qualifications:</label>
                        <p className="text-white">{application.qualifications}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Experience:</label>
                        <p className="text-white">{application.experience}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ModeratorTable;
