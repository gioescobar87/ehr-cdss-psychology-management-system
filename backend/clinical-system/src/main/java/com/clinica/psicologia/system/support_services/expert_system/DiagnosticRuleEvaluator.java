package com.clinica.psicologia.system.support_services.expert_system;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Component;

@Component
public class DiagnosticRuleEvaluator {

    public Result evaluate(
            List<Rule> rules,
            List<CriterionReference> criterionReferences,
            Set<Integer> presentCriterionIds) {

        if (rules == null || rules.isEmpty()) {
            return Result.unsupported("Diagnosis has no configured inference rules.");
        }
        if (criterionReferences == null || presentCriterionIds == null) {
            return Result.unsupported("Rule inputs are incomplete.");
        }

        for (Rule rule : rules) {
            if (rule == null || rule.typeName() == null || rule.value() == null
                    || rule.operator() == null || rule.parameter() == null) {
                return Result.unsupported("Rule contains missing values.");
            }
            if (isBasicRule(rule)) {
                if (!Set.of("A", "B", "C", "D").contains(rule.parameter())) {
                    return Result.unsupported("Unsupported basic-rule reference: " + rule.parameter());
                }
            } else if (isExclusionRule(rule)) {
                if (rule.parameter().isBlank()) {
                    return Result.unsupported("Exclusion rule question is empty.");
                }
            } else {
                return Result.unsupported("Unsupported rule type: " + rule.typeName());
            }
            if (!Set.of("=", ">", "<").contains(rule.operator())) {
                return Result.unsupported("Unsupported operator: " + rule.operator());
            }
            if (rule.value() < 0) {
                return Result.unsupported("Rule value cannot be negative.");
            }
            if (isBasicRule(rule) && criterionReferences.stream()
                    .noneMatch(reference -> reference != null
                            && rule.parameter().equals(reference.reference())
                            && reference.criterionId() != null)) {
                return Result.unsupported(
                        "No diagnosis criteria are configured for reference " + rule.parameter() + ".");
            }
        }

        for (Rule rule : rules) {
            if (!isBasicRule(rule)) {
                continue;
            }
            List<Integer> groupCriterionIds = criterionReferences.stream()
                    .filter(reference -> reference != null && rule.parameter().equals(reference.reference()))
                    .map(CriterionReference::criterionId)
                    .filter(id -> id != null)
                    .distinct()
                    .toList();

            long presentCount = groupCriterionIds.stream()
                    .filter(presentCriterionIds::contains)
                    .count();
            if (!compare(presentCount, rule.operator(), rule.value())) {
                return new Result(true, false,
                        "Basic rule " + rule.parameter() + " was not satisfied ("
                                + presentCount + " criteria " + rule.operator() + " " + rule.value() + ").");
            }
        }

        return new Result(true, true, "All supported rules were satisfied.");
    }

    public Result evaluateExclusion(Rule rule, Integer answer) {
        if (rule == null || !isExclusionRule(rule) || rule.value() == null
                || rule.operator() == null || rule.parameter() == null || rule.parameter().isBlank()) {
            return Result.unsupported("Exclusion rule is malformed.");
        }
        if (!Set.of("=", ">", "<").contains(rule.operator()) || rule.value() < 0) {
            return Result.unsupported("Exclusion rule has an unsupported operator or value.");
        }
        if (answer == null || (answer != 0 && answer != 1)) {
            return Result.unsupported("An explicit Yes/No answer is required for every exclusion rule.");
        }
        return new Result(true, compare(answer, rule.operator(), rule.value()),
                "Exclusion answer was evaluated against its configured rule.");
    }

    public boolean isBasicRule(Rule rule) {
        return rule != null && "BASICA".equals(normalizeRuleType(rule.typeName()));
    }

    public boolean isExclusionRule(Rule rule) {
        return rule != null && "EXCLUSION".equals(normalizeRuleType(rule.typeName()));
    }

    private String normalizeRuleType(String name) {
        if (name == null) {
            return "";
        }
        return Normalizer.normalize(name.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT);
    }

    private boolean compare(long count, String operator, int value) {
        return switch (operator) {
            case "=" -> count == value;
            case ">" -> count > value;
            case "<" -> count < value;
            default -> false;
        };
    }

    public record Rule(Integer ruleId, String typeName, Integer value, String operator, String parameter) {
        public Rule(String typeName, Integer value, String operator, String parameter) {
            this(null, typeName, value, operator, parameter);
        }
    }

    public record CriterionReference(Integer criterionId, String reference) {
    }

    public record Result(boolean supported, boolean satisfied, String detail) {
        private static Result unsupported(String detail) {
            return new Result(false, false, detail);
        }
    }
}