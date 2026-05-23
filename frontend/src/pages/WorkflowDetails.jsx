import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkflow, executeWorkflow } from '../services/workflows';
import { ArrowLeft, Play, Clock, Activity, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function WorkflowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [executing, setExecuting] = useState(false);
  const [expandedExecs, setExpandedExecs] = useState({});
  const [success, setSuccess] = useState('');
  const [execError, setExecError] = useState('');

  const toggleExpanded = (execId) => {
    setExpandedExecs(prev => ({
      ...prev,
      [execId]: !prev[execId]
    }));
  };

  useEffect(() => {
    fetchWorkflow();
  }, [id]);

  const fetchWorkflow = async () => {
    try {
      const data = await getWorkflow(id);
      setWorkflow(data);
    } catch (err) {
      setError('Failed to load workflow details');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setSuccess('');
    setExecError('');
    try {
      await executeWorkflow(id);
      await fetchWorkflow(); // Refresh data to show new execution
      setSuccess('Workflow executed successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setExecError('Failed to execute workflow');
      setTimeout(() => setExecError(''), 4000);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading workflow...</div>;
  }

  if (error || !workflow) {
    return <div className="p-8 text-center text-red-500">{error || 'Workflow not found'}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm flex items-center shadow-sm">
            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {success}
          </div>
        )}

        {execError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center shadow-sm">
            <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {execError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{workflow.workflow_name}</h2>
                <button
                  onClick={handleExecute}
                  disabled={executing}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {executing ? 'Executing...' : 'Run Workflow'}
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Configuration JSON</h3>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                  {JSON.stringify(workflow.workflow_json, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Metadata
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(workflow.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(workflow.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Execution History</h3>
                {workflow.executions && workflow.executions.length > 0 && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-medium">
                    {workflow.executions.length} runs
                  </span>
                )}
              </div>
              <div className="p-6 max-h-[500px] overflow-y-auto space-y-4">
                {!workflow.executions || workflow.executions.length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
                    No executions yet.
                    <br />
                    <span className="text-xs">Click "Run Workflow" to trigger an execution.</span>
                  </div>
                ) : (
                  [...workflow.executions].sort((a, b) => b.id - a.id).map((exec) => {
                    const isExpanded = !!expandedExecs[exec.id];
                    const hasLogs = exec.logs && exec.logs.length > 0;
                    
                    let statusBg = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
                    let statusIcon = <Clock className="w-3.5 h-3.5 mr-1" />;
                    
                    if (exec.execution_status === "completed") {
                      statusBg = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
                      statusIcon = <CheckCircle className="w-3.5 h-3.5 mr-1" />;
                    } else if (exec.execution_status === "failed") {
                      statusBg = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
                      statusIcon = <XCircle className="w-3.5 h-3.5 mr-1" />;
                    } else if (exec.execution_status === "running") {
                      statusBg = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
                      statusIcon = <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />;
                    }

                    return (
                      <div key={exec.id} className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50/50 dark:bg-gray-800/50 transition-all hover:border-gray-200 dark:hover:border-gray-600">
                        <div 
                          onClick={() => hasLogs && toggleExpanded(exec.id)}
                          className={`p-4 flex items-center justify-between ${hasLogs ? 'cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50' : ''}`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">Run #{exec.id}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBg}`}>
                                {statusIcon}
                                {exec.execution_status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Started: {new Date(exec.started_at).toLocaleString()}
                            </div>
                          </div>
                          
                          {hasLogs && (
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                        
                        {isExpanded && hasLogs && (
                          <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-950 p-3 font-mono text-[11px] text-gray-300 max-h-40 overflow-y-auto">
                            {exec.logs.map((log, idx) => (
                              <div key={idx} className="py-0.5 border-b border-gray-900 last:border-b-0 leading-relaxed">
                                <span className="text-gray-500 mr-2">[{new Date(exec.completed_at || exec.started_at).toLocaleTimeString()}]</span>
                                <span className={exec.execution_status === 'failed' ? 'text-red-400' : 'text-green-400'}>
                                  {log.message || JSON.stringify(log)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
