import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  MapPin,
  Users,
  Package,
  Truck,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface DispatchRow {
  id: string
  batchNumber: number
  clusterName: string
  station: string
  region: string
  countTO: number
  totalOIDLoaded: number
  actualDockedTime: string
  dockNumber: string
  actualDepartTime: string
  processorName: string
  lHTripNumber: string
  plateNumber: string
  fleetSize: string
  assignedPIC: string
  dockConfirmed: boolean
}

const fleetSizes = ["4WH", "6W", "6WF", "10WH", "CV"]
const mockClusterNames = ["MNL-001", "CBU-002", "CEB-003", "DVO-004", "ZAM-005"]
const mockStations = ["Hub-A", "Hub-B", "Hub-C", "Hub-D"]
const mockRegions = ["NCR", "LUZON", "VISAYAS", "MINDANAO"]
const mockProcessors = ["Juan Dela Cruz", "Maria Santos", "Jose Reyes", "Ana Garcia"]

export function DispatchReportTable() {
  const [rows, setRows] = useState<DispatchRow[]>([
    {
      id: "1",
      batchNumber: 1,
      clusterName: "",
      station: "",
      region: "",
      countTO: 0,
      totalOIDLoaded: 0,
      actualDockedTime: "",
      dockNumber: "",
      actualDepartTime: "",
      processorName: "",
      lHTripNumber: "",
      plateNumber: "",
      fleetSize: "4WH",
      assignedPIC: "",
      dockConfirmed: false
    }
  ])
  
  const [filteredClusters, setFilteredClusters] = useState<string[]>([])
  const [filteredProcessors, setFilteredProcessors] = useState<string[]>([])
  const [showClusterDropdown, setShowClusterDropdown] = useState<string | null>(null)
  const [showProcessorDropdown, setShowProcessorDropdown] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  // Auto-fill batch numbers
  useEffect(() => {
    setRows(prevRows => 
      prevRows.map((row, index) => ({
        ...row,
        batchNumber: index + 1
      }))
    )
  }, [rows.length])

  // Auto-fill station and region based on cluster
  const handleClusterChange = (rowId: string, value: string) => {
    setRows(prevRows => 
      prevRows.map(row => {
        if (row.id === rowId) {
          const clusterIndex = mockClusterNames.indexOf(value)
          return {
            ...row,
            clusterName: value,
            station: clusterIndex >= 0 ? mockStations[clusterIndex % mockStations.length] : "",
            region: clusterIndex >= 0 ? mockRegions[clusterIndex % mockRegions.length] : ""
          }
        }
        return row
      })
    )
  }

  // Filter clusters based on input
  const handleClusterInput = (rowId: string, value: string) => {
    handleClusterChange(rowId, value)
    
    if (value.length >= 3) {
      const filtered = mockClusterNames.filter(cluster => 
        cluster.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredClusters(filtered)
      setShowClusterDropdown(rowId)
    } else {
      setShowClusterDropdown(null)
    }
  }

  // Filter processors based on input
  const handleProcessorInput = (rowId: string, value: string) => {
    setRows(prevRows => 
      prevRows.map(row => 
        row.id === rowId ? { ...row, processorName: value } : row
      )
    )
    
    if (value.length >= 3) {
      const filtered = mockProcessors.filter(processor => 
        processor.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredProcessors(filtered)
      setShowProcessorDropdown(rowId)
    } else {
      setShowProcessorDropdown(null)
    }
  }

  // Add new row
  const addRow = () => {
    const newRow: DispatchRow = {
      id: Date.now().toString(),
      batchNumber: rows.length + 1,
      clusterName: "",
      station: "",
      region: "",
      countTO: 0,
      totalOIDLoaded: 0,
      actualDockedTime: "",
      dockNumber: `D-${rows.length + 1}`,
      actualDepartTime: "",
      processorName: "",
      lHTripNumber: "",
      plateNumber: "",
      fleetSize: "4WH",
      assignedPIC: "",
      dockConfirmed: false
    }
    setRows([...rows, newRow])
  }

  // Delete row
  const deleteRow = (rowId: string) => {
    setRows(rows.filter(row => row.id !== rowId))
  }

  // Clear all rows
  const clearAll = () => {
    setRows([{
      id: "1",
      batchNumber: 1,
      clusterName: "",
      station: "",
      region: "",
      countTO: 0,
      totalOIDLoaded: 0,
      actualDockedTime: "",
      dockNumber: "",
      actualDepartTime: "",
      processorName: "",
      lHTripNumber: "",
      plateNumber: "",
      fleetSize: "4WH",
      assignedPIC: "",
      dockConfirmed: false
    }])
  }

  // Handle cell edit
  const handleCellEdit = (rowId: string, field: keyof DispatchRow, value: string | number | boolean) => {
    setRows(prevRows => 
      prevRows.map(row => 
        row.id === rowId ? { ...row, [field]: value } : row
      )
    )
  }

  // Calculate metrics
  const totalBatches = rows.length
  const totalVolume = rows.reduce((sum, row) => sum + row.totalOIDLoaded, 0)
  const avgProductivity = totalBatches > 0 ? Math.round((totalVolume / totalBatches) * 10) / 10 : 0

  return (
    <div className="space-y-6">
      {/* Scorecards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
            transition: { duration: 0.3 }
          }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 opacity-90"></div>
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-40">
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-sm font-medium text-white/80 mb-2">Number of Batches</p>
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{totalBatches}</p>
                <div className="w-12 h-1 bg-white/40 rounded-full"></div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
            transition: { duration: 0.3 }
          }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 opacity-90"></div>
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-40">
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-sm font-medium text-white/80 mb-2">Volume Loaded</p>
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{totalVolume.toLocaleString()}</p>
                <div className="w-12 h-1 bg-white/40 rounded-full"></div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)",
            transition: { duration: 0.3 }
          }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 opacity-90"></div>
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-40">
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-sm font-medium text-white/80 mb-2">Productivity</p>
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{avgProductivity}</p>
                <p className="text-xs text-white/60">avg per batch</p>
                <div className="w-12 h-1 bg-white/40 rounded-full"></div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start items-center mb-6">
        <div className="flex gap-3">
          <Button
            onClick={addRow}
            className="bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
          <Button
            onClick={clearAll}
            variant="outline"
            className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Editable Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div ref={tableRef} className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Batch #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Cluster Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Station</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Region</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Count of TO</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Total OID Loaded</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actual Docked Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Dock #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actual Depart Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Name of Processor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">LH Trip #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Plate #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Fleet Size</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Assigned PIC / OPS Coor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-sky-400"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 text-sky-800 font-bold text-sm shadow-sm">
                        {row.batchNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <Input
                        value={row.clusterName}
                        onChange={(e) => handleClusterInput(row.id, e.target.value)}
                        placeholder="Type 3+ chars..."
                        className="w-36 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                      {showClusterDropdown === row.id && filteredClusters.length > 0 && (
                        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-auto">
                          {filteredClusters.map(cluster => (
                            <div
                              key={cluster}
                              onClick={() => {
                                handleClusterChange(row.id, cluster)
                                setShowClusterDropdown(null)
                              }}
                              className="px-4 py-3 hover:bg-sky-50 cursor-pointer text-sm transition-colors"
                            >
                              {cluster}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 font-medium">{row.station || "Auto-filled"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        {row.region || "Auto-filled"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        min="0"
                        value={row.countTO}
                        onChange={(e) => handleCellEdit(row.id, 'countTO', parseInt(e.target.value) || 0)}
                        className="w-24 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        min="0"
                        value={row.totalOIDLoaded}
                        onChange={(e) => handleCellEdit(row.id, 'totalOIDLoaded', parseInt(e.target.value) || 0)}
                        className="w-28 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="datetime-local"
                        value={row.actualDockedTime}
                        onChange={(e) => handleCellEdit(row.id, 'actualDockedTime', e.target.value)}
                        className="w-40 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Input
                          value={row.dockNumber}
                          onChange={(e) => handleCellEdit(row.id, 'dockNumber', e.target.value)}
                          className="w-24 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        />
                        <input
                          type="checkbox"
                          checked={row.dockConfirmed}
                          onChange={(e) => handleCellEdit(row.id, 'dockConfirmed', e.target.checked)}
                          className="h-5 w-5 text-sky-600 rounded-lg border-gray-300 focus:ring-sky-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="datetime-local"
                        value={row.actualDepartTime}
                        onChange={(e) => handleCellEdit(row.id, 'actualDepartTime', e.target.value)}
                        min={row.actualDockedTime}
                        className="w-40 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <Input
                        value={row.processorName}
                        onChange={(e) => handleProcessorInput(row.id, e.target.value)}
                        placeholder="Type 3+ chars..."
                        className="w-36 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                      {showProcessorDropdown === row.id && filteredProcessors.length > 0 && (
                        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-auto">
                          {filteredProcessors.map(processor => (
                            <div
                              key={processor}
                              onClick={() => {
                                handleCellEdit(row.id, 'processorName', processor)
                                setShowProcessorDropdown(null)
                              }}
                              className="px-4 py-3 hover:bg-sky-50 cursor-pointer text-sm transition-colors"
                            >
                              {processor}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        value={row.lHTripNumber}
                        onChange={(e) => handleCellEdit(row.id, 'lHTripNumber', e.target.value.toUpperCase())}
                        placeholder="LT..."
                        className="w-28 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 uppercase"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        value={row.plateNumber}
                        onChange={(e) => handleCellEdit(row.id, 'plateNumber', e.target.value.toUpperCase())}
                        className="w-24 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 uppercase"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={row.fleetSize}
                        onChange={(e) => handleCellEdit(row.id, 'fleetSize', e.target.value)}
                        className="w-20 h-10 text-sm border-gray-200 rounded-xl px-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      >
                        {fleetSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <Input
                          value={row.assignedPIC}
                          onChange={(e) => handleCellEdit(row.id, 'assignedPIC', e.target.value)}
                          placeholder="OPS ID..."
                          className="w-28 h-10 text-sm border-gray-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => deleteRow(row.id)}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Button Below Table */}
      <div className="flex justify-center mt-8">
        <Button
          className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3 text-base font-semibold border-0"
        >
          <Save className="h-5 w-5 mr-2" />
          Submit Report
        </Button>
      </div>
    </div>
  )
}
